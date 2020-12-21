import { Component } from '@angular/core';
import { LedControlApiService, UiStripSegment } from "./service/led-control-api.service";
import { LiveLedsApiService } from "./service/live-leds-api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public wledApi: LedControlApiService,
    public liveApi: LiveLedsApiService
  ) {
    this.wledApi.ensureCurrentResponse();
    this.liveApi.livePreviewEnabled = true;
  }

  segmentIdFor(index: number, seg: UiStripSegment) {
    return seg.segmentId + "";
  }
}
