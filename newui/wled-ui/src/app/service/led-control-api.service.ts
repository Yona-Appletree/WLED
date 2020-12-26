import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { asSequence } from "sequency";
import { Cached } from "../util/cached.decorator";
import {
  CloudColors_p,
  ForestColors_p,
  LavaColors_p,
  OceanColors_p,
  PartyColors_p, RainbowColors_p, RainbowStripeColors_p
} from "../util/data/fastled-palettes.data";
import { wledGradientPaletteNames, wledGradientPalettes } from "../util/data/wled-gradient-palettes.data";
import { effectModeInfoMap, WledEffectModeInfo, WledEffectOptionInfo } from "../util/data/wled-patterns.data";
import { Dictionary } from "../util/dictionary.util";
import { buildInfoMap } from "../util/info-map.util";
import { uint8, uint8FromFrac } from "../util/number.util";
import { timeoutPromise } from "../util/promise.util";
import { ConfigService } from "./config.service";
import {
  UiColor, UiColorCompatible,
  UiPalette
} from "../util/ui-color";
import {
  isWledApiFullResponse,
  UInt16,
  UInt8,
  WledApiFullResponse,
  WLedApiSegmentDefinition,
  WledEffectModeIndex, WledOptionalRgbColor,
} from "../util/wled.api";

@Injectable({
  providedIn: 'root'
})
export class LedControlApiService {
  private _currentResponse: Partial<WledApiFullResponse> = {}

  private _currentStatus: UiWledStatus | null = null;
  get currentStatus() {
    if (! this._currentResponse) return null;

    if (this._currentStatus?.apiModel !== this._currentResponse
    && isWledApiFullResponse(this._currentResponse)
    ) {
      this._currentStatus = new UiWledStatus(this, this._currentResponse);
    }

    return this._currentStatus;
  }

  private lastRequestSentAt = 0;
  private lastResponseReceivedAt = 0;

  private currentRequestPromise: Promise<unknown> | null = null;

  constructor(
    private config: ConfigService
  ) { }

  private async sendJsonRequest(
    method: "GET" | "POST",
    path: string,
    payload?: object | null
  ): Promise<unknown> {
    await this.currentRequestPromise;

    this.lastRequestSentAt = Date.now();

    this.currentRequestPromise = fetch(
      this.config.serviceRoot + path,
      {
        method: method,
        body: payload && JSON.stringify(payload) || undefined
      })
      .then(it => it.json())
      .then(it => it as Partial<WledApiFullResponse>)
      .then(async it => {
        this._currentResponse = {
          ... this._currentResponse,
          ... it,
        };

        this.lastResponseReceivedAt = Date.now();
        this.currentRequestPromise = null;
      });

    await this.currentRequestPromise;

    return this._currentResponse;
  }

  updateStatus(): Promise<WledApiFullResponse> {
    return this.sendJsonRequest("GET", "/json").then(() => this._currentResponse as WledApiFullResponse);
  }

  /**
   * Ensures that our current copy of the response from WLED is up-to-date. Will automatically wait for any pending
   * request and update the info if it's stale.
   */
  async ensureCurrentResponse() {
    await this.currentRequestPromise;

    if ((Date.now() - this.lastRequestSentAt) > 1000
     || ! isWledApiFullResponse(this._currentResponse)
    ) {
      return this.updateStatus();
    }

    return this._currentResponse as WledApiFullResponse;
  }

  async addSegment(
    newSegmentData: Omit<WLedApiSegmentDefinition, "id">
  ) {
    const status = await this.ensureCurrentResponse();

    const nextId = (asSequence(status.state.seg).map(it => it.id).max() ?? -1) + 1;

    const segmentData = {
      id: nextId,
      ... newSegmentData
    };

    return this.sendJsonRequest(
      "POST",
      "/json/si",
      {
        "seg": segmentData,
        "v":true
      }
    );
  }


  private segmentUpdateMap: Dictionary<{
    updatePromise?: Promise<unknown>,
    nextUpdate?: Partial<WLedApiSegmentDefinition>
  }> = {};

  private ensureSegmentUpdate(
    segmentId: number
  ) {
    if (! this.segmentUpdateMap[segmentId + ""]) {
      this.segmentUpdateMap[segmentId + ""] = {}
    }

    return this.segmentUpdateMap[segmentId + ""];
  }

  async updateSegment(
    segmentId: number,
    segment: Partial<WLedApiSegmentDefinition>
  ) {
    const updateInfo = this.ensureSegmentUpdate(segmentId);

    if (updateInfo.nextUpdate) {
      updateInfo.nextUpdate = {
        ... updateInfo?.nextUpdate,
        ... segment
      };
    } else {
      updateInfo.nextUpdate = segment;

      await updateInfo.updatePromise;

      const update = updateInfo.nextUpdate;
      updateInfo.nextUpdate = undefined;

      updateInfo.updatePromise = this.sendJsonRequest(
        "POST",
        "/json/si",
        {
          "seg": {
            ... update,
            id: segmentId
          },
          "v":true
        }
      ).finally(() => { updateInfo.updatePromise = undefined })
    }
  }
}



/**
 * Wrapper for overall WLED status. Used to provide a friendly API for the UI controls.
 */
export class UiWledStatus {
  constructor(
    private apiService: LedControlApiService,
    public apiModel: WledApiFullResponse
  ) {}

  @Cached()
  get segments(): UiStripSegment[] {
    return this.apiModel.state.seg.map(it => new UiStripSegment(this, this.apiService, it));
  }
}

/**
 * Wrapper for Strip Segments for the UI. Provides friendly aliases for properties and shortcuts for mutations.
 */
export class UiStripSegment implements IUiStripSegment {
  constructor(
    private globalStatus: UiWledStatus,
    private apiService: LedControlApiService,
    private apiModel: WLedApiSegmentDefinition
  ) {}

  get manualPaletteColors() { return this.apiModel.col; }

  // Segment id
  get segmentId() { return this.apiModel.id; }

  // WS2812FX::Segment::start
  get startLedIndex() { return this.apiModel.start; }

  // WS2812FX::Segment::stop
  get endLedIndex() { return this.apiModel.stop; }

  // WS2812FX::Segment::mode
  get effectIndex() { return this.apiModel.fx; }

  // WS2812FX::Segment::speed
  get effectSpeed() { return this.apiModel.sx; }

  // WS2812FX::Segment::intensity
  get effectIntensity() { return this.apiModel.ix; }

  // WS2812FX::Segment::palette
  get paletteIndex() { return this.apiModel.pal; }

  // WS2812FX::Segment::grouping
  get groupIndex() { return this.apiModel.grp; }

  // WS2812FX::Segment::spacing
  get spacing() { return this.apiModel.spc; }

  // WS2812FX::Segment::opacity
  get brightness() { return this.apiModel.bri; }

  // WS2812FX::Segment::stop - WS2812FX::Segment::start
  get ledCount() { return this.apiModel.len; }

  // WS2812FX::Segment::options & SEG_OPTION_ON
  get isActive() { return this.apiModel.on; }

  // WS2812FX::Segment::options & SEG_OPTION_MIRROR
  get isMirrored() { return this.apiModel.mi; }

  // WS2812FX::Segment::options & SEG_OPTION_REVERSED
  get isReversed() { return this.apiModel.rev; }

  // WS2812FX::Segment::options & SEG_OPTION_SELECTED
  get isSelected() { return this.apiModel.sel; }

  @Cached()
  get effectInfo() {
    const info = effectModeInfoMap.values.find(it => it.wledIndex === this.effectIndex);
    return info && new UiWledEffectInfo(this, info) || null;
  }

  updateEffectSpeed(value: number | string) {
    this.update({
      effectSpeed: uint8(value)
    });
  }

  updateEffectIntensity(value: number | string) {
    this.update({
      effectIntensity: uint8(value)
    });
  }

  // Emulates void WS2812FX::handle_palette(void)
  @Cached()
  get paletteGroups() {
    const nonZeroPalettes = [
      // 0: Automatic... replaced later in this function to better represent the actual value
      new UiWledPalette(0, "Automatic", new UiPalette([])),

      // 1: random color. We use the fallback here since we don't actually know the current palette from WLED
      new UiWledPalette(1,"Random", PartyColors_p),

      // 2: {//primary color only
      new UiWledPalette(
        2,
        "One Custom Color",
        UiPalette.fromColors([ this.manualPaletteColors[0] ]),
        this.manualPaletteColors.slice(0, 1).map(it => UiColor.from(it))
      ),

      // 3: {//primary + secondary
      new UiWledPalette(
        3,
        "Two Custom Colors",
        UiPalette.fromColors([ this.manualPaletteColors[0], this.manualPaletteColors[1] ]),
        this.manualPaletteColors.slice(0, 2).map(it => UiColor.from(it))
      ),

      // 4: {//primary + secondary + tertiary
      new UiWledPalette(
        4,
        "Three Custom Colors",
        UiPalette.fromColors([ this.manualPaletteColors[0], this.manualPaletteColors[1], this.manualPaletteColors[2] ]),
        this.manualPaletteColors.map(it => UiColor.from(it))
      ),

      // 5: {//primary + secondary (+tert if not off), more distinct
      new UiWledPalette(
        5,
        "Distinct Custom Colors", (()=>{
          const prim = this.manualPaletteColors[0];
          const sec  = this.manualPaletteColors[1];
          const ter  = this.manualPaletteColors[2];

          if (ter?.length) {
            return UiPalette.fromColors([ prim,prim,prim,prim,prim,sec,sec,sec,sec,sec,ter,ter,ter,ter,ter,prim ]);
          } else {
            return UiPalette.fromColors([ prim,prim,prim,prim,prim,prim,prim,prim,sec,sec,sec,sec,sec,sec,sec,sec ]);
          }
        })(),
        this.manualPaletteColors.map(it => UiColor.from(it))
      ),

      // 6: Party colors
      new UiWledPalette(6, "Party colors", PartyColors_p),

      // 7: Cloud colors
      new UiWledPalette(7, "Cloud colors", CloudColors_p),

      // 8: Lava colors
      new UiWledPalette(8, "Lava colors", LavaColors_p),

      // 9: Ocean colors
      new UiWledPalette(9, "Ocean colors", OceanColors_p),

      // 10: Forest colors
      new UiWledPalette(10, "Forest colors", ForestColors_p),

      // 11: Rainbow colors
      new UiWledPalette(11, "Rainbow colors", RainbowColors_p),

      // 12: Rainbow stripe colors
      new UiWledPalette(12, "Rainbow stripe colors", RainbowStripeColors_p),

      ... wledGradientPalettes.map(
        (it, i) => new UiWledPalette(
          13 + i,
          wledGradientPaletteNames[i],
          it
        )
      )
    ];

    const autoPalette = (() => {
      switch (this.effectIndex) {
        case WledEffectModeIndex.FIRE_2012  : return nonZeroPalettes[35]; // heat palette
        case WledEffectModeIndex.COLORWAVES : return nonZeroPalettes[26]; // landscape 33
        case WledEffectModeIndex.FILLNOISE8 : return nonZeroPalettes[ 9]; // ocean colors
        case WledEffectModeIndex.NOISE16_1  : return nonZeroPalettes[20]; // Drywet
        case WledEffectModeIndex.NOISE16_2  : return nonZeroPalettes[43]; // Blue cyan yellow
        case WledEffectModeIndex.NOISE16_3  : return nonZeroPalettes[35]; // heat palette
        case WledEffectModeIndex.NOISE16_4  : return nonZeroPalettes[26]; // landscape 33
        case WledEffectModeIndex.GLITTER    : return nonZeroPalettes[11]; // rainbow colors
        case WledEffectModeIndex.SUNRISE    : return nonZeroPalettes[35]; // heat palette
        case WledEffectModeIndex.FLOW       : return nonZeroPalettes[ 6]; // party
        default                             : return nonZeroPalettes[14];
      }
    })();

    const palettes = [
      new UiWledPalette(
        0,
        `Automatic (${autoPalette.name})`,
        autoPalette?.palette!
      ),
      ...nonZeroPalettes.slice(1)
    ];

    return buildInfoMap<
      "groupId",
      UiWledPaletteGroupId,
      UiWledPaletteGroupInfo
    >(
      "groupId",
      {
        dynamic: {
          name: "Dynamic",
          customizable: false,
          palettes: [
            palettes[ 0 ],
            palettes[ 1 ],
          ]
        },

        userDefined: {
          name: "Custom Palette Styles",
          customizable: true,
          palettes: [
            palettes[ 2 ],
            palettes[ 3 ],
            palettes[ 4 ],
            palettes[ 5 ],
          ]
        },

        fastLed: {
          name: "Fast LED Palettes",
          customizable: false,
          palettes: [
            palettes[ 6 ],
            palettes[ 7 ],
            palettes[ 8 ],
            palettes[ 9 ],
            palettes[ 10 ],
            palettes[ 11 ],
            palettes[ 12 ],
          ]
        },

        gradient: {
          name: "Gradient Palettes",
          customizable: false,
          palettes: palettes.slice(13)
        },
      }
    )
  }

  @Cached()
  get palettes() {
    return asSequence(this.paletteGroups.values)
      .flatMap(it => asSequence(it.palettes))
      .toArray();
  }

  @Cached()
  get customizablePaletteGroups() {
    return this.paletteGroups.values.filter(it => it.customizable);
  }

  @Cached()
  get presetPaletteGroups() {
    return this.paletteGroups.values.filter(it => ! it.customizable);
  }

  get selectedPalette() {
    return this.palettes[this.paletteIndex];
  }

  @Cached()
  get isCustomPaletteSelected() {
    return asSequence(this.customizablePaletteGroups)
      .flatMap(it => asSequence(it.palettes))
      .contains(this.selectedPalette);
  }

  @Cached()
  get isPresetPaletteSelected() {
    return asSequence(this.presetPaletteGroups)
      .flatMap(it => asSequence(it.palettes))
      .contains(this.selectedPalette);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Mutations

  private update(updates: Partial<IUiStripSegment>) {
    this.apiService.updateSegment(
      this.segmentId,
      {
        col: updates.manualPaletteColors ?? this.manualPaletteColors,
        id: updates.segmentId ?? this.segmentId,
        start: updates.startLedIndex ?? this.startLedIndex,
        stop: updates.endLedIndex ?? this.endLedIndex,
        fx: updates.effectIndex ?? this.effectIndex,
        sx: updates.effectSpeed ?? this.effectSpeed,
        ix: updates.effectIntensity ?? this.effectIntensity,
        pal: updates.paletteIndex ?? this.paletteIndex,
        grp: updates.groupIndex ?? this.groupIndex,
        spc: updates.spacing ?? this.spacing,
        bri: updates.brightness ?? this.brightness,
        len: updates.ledCount ?? this.ledCount,
        on: updates.isActive ?? this.isActive,
        mi: updates.isMirrored ?? this.isMirrored,
        rev: updates.isReversed ?? this.isReversed,
        sel: updates.isSelected ?? this.isSelected,
      }
    )
  }

  delete() {
    return this.apiService.updateSegment(this.segmentId, { stop: 0 });
  }

  selectPalette(palette: number | UiWledPalette) {
    const paletteIndex = typeof palette === "number"
                         ? palette
                         : palette.wledIndex;

    if (paletteIndex != this.paletteIndex) {
      this.update({
        paletteIndex: uint8(paletteIndex)
      })
    }
  }

  updateManualPaletteColors(colors: Array<UiColorCompatible | null | undefined>) {
    return this.update({
      manualPaletteColors: colors.map(it => UiColor.from(it)?.wledColor || [ 0, 0, 0 ])
    })
  }

  selectBestCustomPalette() {
    const colors = this.manualPaletteColors.map(it => UiColor.from(it));

    const customPalettes = this.paletteGroups.map.userDefined.palettes;

    if (colors[1] || colors[2]) {
      this.selectPalette(customPalettes[3])
    } else {
      this.selectPalette(customPalettes[0])
    }
  }

  selectBestPresetPalette() {
    this.selectPalette(
      this.paletteGroups.map.dynamic.palettes[0]
    )
  }

  selectEffect(effectInfo: WledEffectModeInfo) {
    this.update({
      effectIndex: effectInfo.wledIndex
    })
  }

  updateManualColor(
    colorIndex: 0 | 1 | 2,
    color: UiColorCompatible | null
  ) {
    return this.updateManualPaletteColors([
      ... this.manualPaletteColors.slice(0, colorIndex),
      UiColor.from(color)?.wledColor || [],
      ... this.manualPaletteColors.slice(colorIndex + 1),
    ]);
  }
}

export type UiWledPaletteGroupId = "dynamic" | "userDefined" | "fastLed" | "gradient";

export interface UiWledPaletteGroupInfo {
  groupId: UiWledPaletteGroupId;
  name: string;
  palettes: UiWledPalette[];
  customizable: boolean;
}

export class UiWledEffectInfo {
  constructor(
    public segmentInfo: UiStripSegment,
    public apiModel: WledEffectModeInfo
  ) {}

  get wledIndex() { return this.apiModel.wledIndex }
  get effectId() { return this.apiModel.effectId }
  get wledFxMethod() { return this.apiModel.wledFxMethod }
  get wledUiName() { return this.apiModel.wledUiName }
  get proposedName() { return this.apiModel.proposedName }
  get description() { return this.apiModel.description }

  get devNotes() { return this.apiModel.devNotes }
  get showcase() { return this.apiModel.showcase }
  get author() { return this.apiModel.author }

  get speedLabel() {
    const info = this.apiModel.speedInfo;
    if (info) {
      return info === true ? "Speed" : info;
    } else {
      return false;
    }
  }

  get intensityLabel() {
    const info = this.apiModel.intensityInfo;
    if (info) {
      return info === true ? "Intensity" : info
    } else {
      return false;
    }
  }

  @Cached()
  get primaryColorInfo() {
    return this.apiModel.primaryColorInfo
      ? new UiWledEffectColorInfo(this.segmentInfo, this, "primary")
      : null;
  }

  @Cached()
  get secondaryColorInfo() {
    return this.apiModel.secondaryColorInfo
      ? new UiWledEffectColorInfo(this.segmentInfo, this, "secondary")
      : null;
  }

  @Cached()
  get tertiaryColorInfo() {
    return this.apiModel.tertiaryColorInfo
      ? new UiWledEffectColorInfo(this.segmentInfo, this, "tertiary")
      : null;
  }

  @Cached()
  get colorInfos(): UiWledEffectColorInfo[] {
    return asSequence([
      this.primaryColorInfo,
      this.secondaryColorInfo,
      this.tertiaryColorInfo,
    ]).filterNotNull().toArray()
  }

  @Cached()
  get paletteInfo() {
    if (! this.apiModel.paletteInfo) {
      return null;
    }

    return {
      label: this.apiModel.paletteInfo === true
             ? "Palette"
             : this.apiModel.paletteInfo,

      // Custom color selection is only allowed when only the palette is used. Otherwise the custom colors would
      // be used twice -- once in the palette and once as a color, causing undesired effects.
      allowCustomColors: this.colorInfos.length === 0
    }
  }
}

export class UiWledEffectColorInfo {
  constructor(
    public segmentInfo: UiStripSegment,
    public effectInfo: UiWledEffectInfo,
    public colorName: "primary" | "secondary" | "tertiary"
  ) {}

  get label(): string | null {
    let info;

    if (this.colorName == "primary") info = this.effectInfo.apiModel.primaryColorInfo;
    else if (this.colorName == "secondary") info = this.effectInfo.apiModel.secondaryColorInfo;
    else if (this.colorName == "tertiary") info = this.effectInfo.apiModel.tertiaryColorInfo;

    if (! info) return null;

    if (info === true) {
      if (this.colorName == "primary") return "Primary Color";
      else if (this.colorName == "secondary") return "Secondary Color";
      else if (this.colorName == "tertiary") return "Tertiary Color";
      else return "Unknown Color"
    } else {
      return info;
    }
  }

  get colorIndex(): 0 | 1 | 2 {
    if (this.colorName == "primary") return 0;
    else if (this.colorName == "secondary") return 1;
    else if (this.colorName == "tertiary") return 2;
    else throw new Error("Invalid color: " + this.colorName);
  }

  /**
   * If true, this color is used when the default palette is selected, and this color should show a palette selector.
   */
  get isPaletteDefault() {
    return this.effectInfo.apiModel.defaultPaletteUsesColor === this.colorName;
  }

  @Cached()
  get currentColor(): UiColor | null {
    return UiColor.from(this.segmentInfo.manualPaletteColors[this.colorIndex]);
  }

  updateColor(newColor: UiColorCompatible | null) {
    this.segmentInfo.updateManualColor(
      this.colorIndex,
      newColor
    );
  }
}

export class UiWledPalette {
  constructor(
    public readonly wledIndex: number,
    public readonly name: string,
    public readonly palette: UiPalette,
    public readonly pickerColors: Array<UiColor | null> | null = null
  ) {}

  get cssGradient() { return this.palette.cssGradient }
}

interface IUiStripSegment {
  manualPaletteColors: WledOptionalRgbColor[];
  segmentId: UInt8;
  startLedIndex: UInt16;
  endLedIndex: UInt16;
  effectIndex: UInt8;
  effectSpeed: UInt8;
  effectIntensity: UInt8;
  paletteIndex: UInt8;
  groupIndex:  UInt8;
  spacing:  UInt8;
  brightness: UInt8;
  ledCount: UInt16;
  isActive: boolean;
  isMirrored: boolean;
  isReversed: boolean;
  isSelected: boolean;
}
