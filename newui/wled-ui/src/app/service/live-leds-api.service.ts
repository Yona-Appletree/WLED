import { Injectable } from '@angular/core';
import { copyCanvas2d } from "../util/canvas.util";
import { ConfigService } from "./config.service";
import { Cached } from "../util/cached.decorator";

@Injectable({
  providedIn: 'root'
})
export class LiveLedsApiService {
  public lastResponse: WledApiLiveResponse = {
    leds: [],
    n: 1
  };

  private livePreviewTimeout: number | null = null;
  private _livePreviewEnabled = false;
  get livePreviewEnabled() {
    return this._livePreviewEnabled;
  }
  set livePreviewEnabled(enable: boolean) {
    this._livePreviewEnabled = enable;

    if (enable) {
      if (this.livePreviewTimeout === null) {
        this.livePreviewTimeout = setTimeout(() => this.update(), 40);
      }
    } else {
      if (this.livePreviewTimeout !== null) {
        clearTimeout(this.livePreviewTimeout);
        this.livePreviewTimeout = null;
      }
    }
  }

  /**
   * The number of history lines that should be kept in the buffer image.
   */
  historyLineCount = 128;

  private updateImages(
    response: WledApiLiveResponse
  ) {
    const currentCanvas = this.currentLineCanvas;
    const historyCanvas = this.historyCanvas;

    const currentContext = currentCanvas.getContext("2d") !;
    const historyContext = historyCanvas.getContext("2d") !;

    if (response.leds.length != currentCanvas.width) {
      currentCanvas.width = response.leds.length;
      historyCanvas.width = response.leds.length;
    }

    if (currentCanvas.height != 1) {
      currentCanvas.height = 1;
    }

    if (this.historyLineCount != historyCanvas.height) {
      const oldCanvas = copyCanvas2d(historyCanvas);
      historyCanvas.height = this.historyLineCount;

      historyContext.drawImage(
        oldCanvas,
        0,
        this.historyLineCount - historyCanvas.height
      );
    }


    for (let i = 0; i<response.leds.length; i++) {
      currentContext.fillStyle = "#" + response.leds[ i ];
      currentContext.fillRect(i, 0, 1, 1);
    }

    historyContext.drawImage(
      historyCanvas,
      0, 1
    );

    historyContext.drawImage(currentCanvas, 0, 0);

    this._currentLineImageUrl = currentCanvas.toDataURL();
    this._historyImageUrl = historyCanvas.toDataURL();
  }

  private _historyImageUrl: string | null = null;
  get historyImageUrl() {
    return this._historyImageUrl;
  }

  @Cached()
  get currentLineCanvas() {
    return document.createElement("canvas");
  }

  @Cached()
  get historyCanvas() {
    return document.createElement("canvas");
  }

  private _currentLineImageUrl: string | null = null;
  get currentLineImageUrl() {
    return this._currentLineImageUrl;
  }


  constructor(
    private config: ConfigService
  ) {}

  update() {
    fetch(this.config.serviceRoot + "/json/live")
      .then(it => it.json())
      .then(it => it as WledApiLiveResponse)
      .then(response => {
        this.lastResponse = response;
        this.livePreviewTimeout = setTimeout(
          () => this.update(),
          40
        );

        // Clear out the cached image
        this.updateImages(response);
      });
  }
}

interface WledApiLiveResponse {
  leds: string[];
  n: number;
}