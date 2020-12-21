import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WledApiService {
  serviceRoot = "http://wled.local"

  private currentResponse: Partial<WledApiFullResponse> = {}

  private currentRequestPromise: Promise<unknown> | null = null;

  constructor() { }

  private async sendRequest(
    path: string,
    payload?: object | null
  ): Promise<unknown> {
    await this.currentRequestPromise;

    this.currentRequestPromise = fetch(this.serviceRoot + path)
      .then(it => it.json())
      .then(it => it as Partial<WledApiFullResponse>)
      .then(it => {
        this.currentResponse = {
          ... this.currentResponse,
          ... it,
        };
      });

    await this.currentRequestPromise;

    return this.currentResponse;
  }

  updateStatus(): Promise<WledApiFullResponse> {
    return this.sendRequest("/json").then(() => this.currentResponse as WledApiFullResponse);
  }
  
  async ensureCurrentResponse() {
    await this.currentResponse;

    if (! this.currentResponse.state
     || ! this.currentResponse.info
     || ! this.currentResponse.effects
     || ! this.currentResponse.palettes
    ) {
      return this.updateStatus();
    }

    return this.currentResponse;
  }

  async addSegment(
    startIndex: UInt16,
    endIndex: UInt16
  ) {
    const status = await this.ensureCurrentResponse();


    return this.sendRequest(
      "/si",
      {
        "seg":{
          "id": status.state?.seg,
          "start": 0,
          "stop": 10
        },
        "v":true
      }
    )
  }
}

interface WledApiFullResponse {
  state?: WledApiGlobalState,
  info?: WledApiGlobalInfo,
  effects?: WledEffectName[],
  palettes?: WledPaletteName[]
}

interface WledApiGlobalInfo {
  // WLED_GLOBAL char versionString[]
  "ver": string,

  // #define VERSION: version code in format yymmddb (b = daily build)
  "vid": number,

  //
  "leds": {
    // WLED_GLOBAL uint16_t ledCount _INIT(30);          // overcurrent prevented by ABL
    "count": UInt16,

    // WLED_GLOBAL bool useRGBW      _INIT(false);       // SK6812 strips can contain an extra White channel
    "rgbw": boolean,

    // useRGBW && (strip.rgbwMode == RGBW_MODE_MANUAL_ONLY || strip.rgbwMode == RGBW_MODE_DUAL); // should a white channel slider be displayed?
    "wv": boolean,

    // #define LEDPIN 2  //strip pin. Any for ESP32, gpio2 or 3 is recommended for ESP8266 (gpio2/3 are labeled D4/RX on NodeMCU and Wemos)
    "pin": [2],

    // WS2812FX::currentMilliamps
    "pwr": UInt16,

    // (WS2812FX::currentMilliamps) ? WS2812FX::ablMilliampsMax : 0
    "maxpwr": UInt16,

    // uint8_t WS2812FX::getMaxSegments(void)
    "maxseg": UInt8,

    // false; //will be used in the future to prevent modifications to segment config
    "seglock": false
  },

  // WLED_GLOBAL bool syncToggleReceive     _INIT(false);   // UIs which only have a single button for sync should toggle send+receive if this is true, only send otherwise
  "str": boolean,

  // WLED_GLOBAL char serverDescription[33] _INIT("WLED");  // Name of module
  "name": string | "WLED",

  // WLED_GLOBAL uint16_t udpPort    _INIT(21324); // WLED notifier default port
  "udpport": 21324,

  // WLED_GLOBAL byte realtimeMode _INIT(REALTIME_MODE_INACTIVE);
  "live": WledApiRealtimeMode,

  /**
   * switch (realtimeMode) {
   *   case REALTIME_MODE_INACTIVE: root["lm"] = ""; break;
   *   case REALTIME_MODE_GENERIC:  root["lm"] = ""; break;
   *   case REALTIME_MODE_UDP:      root["lm"] = F("UDP"); break;
   *   case REALTIME_MODE_HYPERION: root["lm"] = F("Hyperion"); break;
   *   case REALTIME_MODE_E131:     root["lm"] = F("E1.31"); break;
   *   case REALTIME_MODE_ADALIGHT: root["lm"] = F("USB Adalight/TPM2"); break;
   *   case REALTIME_MODE_ARTNET:   root["lm"] = F("Art-Net"); break;
   *   case REALTIME_MODE_TPM2NET:  root["lm"] = F("tpm2.net"); break;
   *   case REALTIME_MODE_DDP:      root["lm"] = F("DDP"); break;
   * }
   */
  "lm": "" | "UDP" | "Hyperion" | "E1.31" | "USB Adalight/TPM2" | "Art-Net" | "tpm2.net" | "DDP",

  /**
   *  (realtimeIP[0] == 0) ? "" : realtimeIP.toString()
   */
  "lip": string,

  /**
   * #ifdef WLED_ENABLE_WEBSOCKETS
   * root[F("ws")] = ws.count();
   * #else
   * root[F("ws")] = -1;
   * #endif
   */
  "ws": 0,

  // uint8_t WS2812FX::getModeCount()
  "fxcount": UInt8,

  // uint8_t WS2812FX::getPaletteCount()
  "palcount": UInt8,

  "wifi": WledApiWifiInfo,
  "arch": WledArchName,

  // String EspClass::getCoreVersion()
  "core": string,

  /**
   * // X.x.x: Major version of the stack
   * #define LWIP_VERSION_MAJOR      1U
   */
  "lwip": 1,

  // ESP.getFreeHeap();
  "freeheap": number,

  // root[F("uptime")] = millis()/1000 + rolloverMillis*4294967;
  "uptime": number,

  /**
   * See WLED_BIT_WLED_*
   */
  "opt": UInt8,

  // Brand string
  "brand": "WLED",

  // Product name
  "product": "FOSS",

  // WLED_GLOBAL String escapedMac;
  "mac": string
}

interface WLedSegmentDefinition {
  col: [ OptionalRgbColorArray, OptionalRgbColorArray, OptionalRgbColorArray ],

  // Segment id
  id: UInt8,

  // WS2812FX::Segment::start
  start: UInt16

  // WS2812FX::Segment::stop
  stop: UInt16,

  // WS2812FX::Segment::mode
  fx: UInt8,

  // WS2812FX::Segment::speed
  sx: UInt8,

  // WS2812FX::Segment::intensity
  ix: UInt8,

  // WS2812FX::Segment::palette
  pal: UInt8,

  // WS2812FX::Segment::grouping
  grp: UInt8,

  // WS2812FX::Segment::spacing
  spc: UInt8,

  // WS2812FX::Segment::opacity
  bri: UInt8

  // WS2812FX::Segment::stop - WS2812FX::Segment::start
  len: UInt16,

  // WS2812FX::Segment::options & SEG_OPTION_ON
  on: boolean,

  // WS2812FX::Segment::options & SEG_OPTION_MIRROR
  mi: boolean,

  // WS2812FX::Segment::options & SEG_OPTION_REVERSED
  rev: boolean,

  // WS2812FX::Segment::options & SEG_OPTION_SELECTED
  sel: boolean,
}

/**
 * realtime override modes
 */
enum WledApiNightlightMode {
  SET       = 0,            // NL_MODE_SET       - After nightlight time elapsed, set to target brightness
  FADE      = 1,            // NL_MODE_FADE      - Fade to target brightness gradually
  COLORFADE = 2,            // NL_MODE_COLORFADE - Fade to target brightness and secondary color gradually
  SUN       = 3,            // NL_MODE_SUN       - Sunrise/sunset. Target brightness is set immediately, then Sunrise effect is started. Max 60 min.
}

enum WledApiRealtimeOverride {
  NONE = 0, // REALTIME_OVERRIDE_NONE
  ONCE = 1, // REALTIME_OVERRIDE_ONCE
  ALWAYS = 2, // REALTIME_OVERRIDE_ALWAYS
}

//E1.31 DMX modes
enum WledApiDmxMode {
  DMX_MODE_DISABLED         = 0, // DMX_MODE_DISABLED     : not used
  DMX_MODE_SINGLE_RGB       = 1, // DMX_MODE_SINGLE_RGB   : all LEDs same RGB color (3 channels)
  DMX_MODE_SINGLE_DRGB      = 2, // DMX_MODE_SINGLE_DRGB  : all LEDs same RGB color and master dimmer (4 channels)
  DMX_MODE_EFFECT           = 3, // DMX_MODE_EFFECT       : trigger standalone effects of WLED (11 channels)
  DMX_MODE_MULTIPLE_RGB     = 4, // DMX_MODE_MULTIPLE_RGB : every LED is addressed with its own RGB (ledCount * 3 channels)
  DMX_MODE_MULTIPLE_DRGB    = 5, // DMX_MODE_MULTIPLE_DRGB: every LED is addressed with its own RGB and share a master dimmer (ledCount * 3 + 1 channels)
  DMX_MODE_MULTIPLE_RGBW    = 6, // DMX_MODE_MULTIPLE_RGBW: every LED is addressed with its own RGBW (ledCount * 4 channels)
}

//realtime modes
enum WledApiRealtimeMode {
  INACTIVE    = 0, // REALTIME_MODE_INACTIVE
  GENERIC     = 1, // REALTIME_MODE_GENERIC
  UDP         = 2, // REALTIME_MODE_UDP
  HYPERION    = 3, // REALTIME_MODE_HYPERION
  E131        = 4, // REALTIME_MODE_E131
  ADALIGHT    = 5, // REALTIME_MODE_ADALIGHT
  ARTNET      = 6, // REALTIME_MODE_ARTNET
  TPM2NET     = 7, // REALTIME_MODE_TPM2NET
  DDP         = 8, // REALTIME_MODE_DDP
}

const BIT_WLED_DEBUG              = 0x80;
const BIT_WLED_DISABLE_ALEXA      = 0x40;
const BIT_WLED_DISABLE_BLYNK      = 0x20;
const BIT_WLED_DISABLE_CRONIXIE   = 0x10;
const BIT_WLED_DISABLE_FILESYSTEM = 0x08;
const BIT_WLED_DISABLE_HUESYNC    = 0x04;
const BIT_WLED_ENABLE_ADALIGHT    = 0x02;
const BIT_WLED_DISABLE_OTA        = 0x01;

// See json.cpp#serializeState
interface WledApiGlobalState {
  // Indicates if current brightness value is greater than 0
  "on": boolean,

  // WLED_GLOBAL byte briLast -- brightness before turned off. Used for toggle function
  "bri": UInt8,

  // WLED_GLOBAL uint16_t transitionDelay / 100 -- transition delay, but divided by 100
  "transition": number,

  // WLED_GLOBAL int16_t currentPreset
  "ps": Int16,

  // WLED_GLOBAL uint16_t savedPresets -- number of currently saved presents?
  "pss": number,


  // WLED_GLOBAL bool presetCyclingEnabled -- but encoded: (presetCyclingEnabled) ? 0: -1
  "pl": Int16,

  // temporary for preset cycle
  "ccnf": {
    // WLED_GLOBAL byte presetCycleMin
    "min": UInt8,

    // WLED_GLOBAL byte presetCycleMax
    "max": UInt8,

    // WLED_GLOBAL uint16_t presetCycleTime
    "time": UInt16
  },

  // "Nightlight" settings
  "nl": {
    // WLED_GLOBAL bool nightlightActive
    "on": boolean,

    // WLED_GLOBAL byte nightlightDelayMins
    "dur": number,

    // WLED_GLOBAL byte nightlightMode -- but encoded (nightlightMode > NL_MODE_SET); //deprecated
    "fade": boolean,

    // WLED_GLOBAL byte nightlightMode // See const.h for available modes. Was nightlightFade
    "mode": WledApiNightlightMode,

    // WLED_GLOBAL byte nightlightTargetBri // brightness after nightlight is over
    "tbri": UInt8,

    // If nightlight mode is active, the remaining seconds: (nightlightDelayMs - (millis() - nightlightStartTime)) / 1000
    // otherwise -1
    "rem": number
  },

  "udpn": {
    // WLED_GLOBAL bool notifyDirect _INIT(false);                       // send notification if change via UI or HTTP API
    "send": false,

    // WLED_GLOBAL bool receiveNotifications _INIT(true);
    "recv": true,

  },

  // WLED_GLOBAL byte realtimeOverride _INIT(REALTIME_OVERRIDE_NONE);
  "lor": WledApiRealtimeOverride

  // uint8_t WS2812FX::getMainSegmentId
  "mainseg": UInt8,

  "seg": WLedSegmentDefinition[]
}

type WledArchName = "esp8266" | "esp32";

interface WledApiWifiInfo {
  "bssid": string,
  "rssi": number, // e.g. -67
  "signal": number, // e.g. 66
  "channel": number, // e.g. 11
}

type WledEffectName =
  | "Solid"
  | "Blink"
  | "Breathe"
  | "Wipe"
  | "Wipe Random"
  | "Random Colors"
  | "Sweep"
  | "Dynamic"
  | "Colorloop"
  | "Rainbow"
  | "Scan"
  | "Scan Dual"
  | "Fade"
  | "Theater"
  | "Theater Rainbow"
  | "Running"
  | "Saw"
  | "Twinkle"
  | "Dissolve"
  | "Dissolve Rnd"
  | "Sparkle"
  | "Sparkle Dark"
  | "Sparkle+"
  | "Strobe"
  | "Strobe Rainbow"
  | "Strobe Mega"
  | "Blink Rainbow"
  | "Android"
  | "Chase"
  | "Chase Random"
  | "Chase Rainbow"
  | "Chase Flash"
  | "Chase Flash Rnd"
  | "Rainbow Runner"
  | "Colorful"
  | "Traffic Light"
  | "Sweep Random"
  | "Running 2"
  | "Red & Blue"
  | "Stream"
  | "Scanner"
  | "Lighthouse"
  | "Fireworks"
  | "Rain"
  | "Merry Christmas"
  | "Fire Flicker"
  | "Gradient"
  | "Loading"
  | "Police"
  | "Police All"
  | "Two Dots"
  | "Two Areas"
  | "Circus"
  | "Halloween"
  | "Tri Chase"
  | "Tri Wipe"
  | "Tri Fade"
  | "Lightning"
  | "ICU"
  | "Multi Comet"
  | "Scanner Dual"
  | "Stream 2"
  | "Oscillate"
  | "Pride 2015"
  | "Juggle"
  | "Palette"
  | "Fire 2012"
  | "Colorwaves"
  | "Bpm"
  | "Fill Noise"
  | "Noise 1"
  | "Noise 2"
  | "Noise 3"
  | "Noise 4"
  | "Colortwinkles"
  | "Lake"
  | "Meteor"
  | "Meteor Smooth"
  | "Railway"
  | "Ripple"
  | "Twinklefox"
  | "Twinklecat"
  | "Halloween Eyes"
  | "Solid Pattern"
  | "Solid Pattern Tri"
  | "Spots"
  | "Spots Fade"
  | "Glitter"
  | "Candle"
  | "Fireworks Starburst"
  | "Fireworks 1D"
  | "Bouncing Balls"
  | "Sinelon"
  | "Sinelon Dual"
  | "Sinelon Rainbow"
  | "Popcorn"
  | "Drip"
  | "Plasma"
  | "Percent"
  | "Ripple Rainbow"
  | "Heartbeat"
  | "Pacifica"
  | "Candle Multi"
  | "Solid Glitter"
  | "Sunrise"
  | "Phased"
  | "Twinkleup"
  | "Noise Pal"
  | "Sine"
  | "Phased Noise"
  | "Flow"
  | "Chunchun"
  | "Dancing Shadows"
  | "Washing Machine";

type WledPaletteName =
    "Default"
  | "* Random Cycle"
  | "* Color 1"
  | "* Colors 1&2"
  | "* Color Gradient"
  | "* Colors Only"
  | "Party"
  | "Cloud"
  | "Lava"
  | "Ocean"
  | "Forest"
  | "Rainbow"
  | "Rainbow Bands"
  | "Sunset"
  | "Rivendell"
  | "Breeze"
  | "Red & Blue"
  | "Yellowout"
  | "Analogous"
  | "Splash"
  | "Pastel"
  | "Sunset 2"
  | "Beech"
  | "Vintage"
  | "Departure"
  | "Landscape"
  | "Beach"
  | "Sherbet"
  | "Hult"
  | "Hult 64"
  | "Drywet"
  | "Jul"
  | "Grintage"
  | "Rewhi"
  | "Tertiary"
  | "Fire"
  | "Icefire"
  | "Cyane"
  | "Light Pink"
  | "Autumn"
  | "Magenta"
  | "Magred"
  | "Yelmag"
  | "Yelblu"
  | "Orange & Teal"
  | "Tiamat"
  | "April Night"
  | "Orangery"
  | "C9"
  | "Sakura"
  | "Aurora"
  | "Atlantica"
  | "C9 2"
  | "C9 New";


type UInt8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;
type UInt16 = number;
type Int16 = number;
type RgbColorArray = [UInt8, UInt8, UInt8];
type RgbwColorArray = [UInt8, UInt8, UInt8, UInt8];
type OptionalRgbColorArray = RgbColorArray | [];
