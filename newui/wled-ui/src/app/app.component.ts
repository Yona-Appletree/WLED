import { AfterViewInit, Component, ElementRef, Host, OnDestroy, ViewChild } from '@angular/core';
import { LedControlApiService, UiStripSegment } from "./service/led-control-api.service";
import { LiveLedsApiService } from "./service/live-leds-api.service";

import ResizeObserver from "resize-observer-polyfill";
import { effectModeInfoMap } from "./util/data/wled-patterns.data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    "(window:resize)": "handleResize()"
  }
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("historyImage")
  historyImage!: ElementRef<HTMLElement>;

  resizeObserver = new ResizeObserver(() => this.handleResize());

  effectInfos = effectModeInfoMap;

  constructor(
    public wledApi: LedControlApiService,
    public liveApi: LiveLedsApiService
  ) {
    this.wledApi.ensureCurrentResponse();
    this.liveApi.livePreviewEnabled = true;
  }

  trackByIndex(index: number) {
    return index + "";
  }

  handleResize() {
    this.liveApi.historyLineCount = this.historyImage.nativeElement?.getBoundingClientRect().height / 4 ?? 256;
  }

  ngAfterViewInit(): void {
    this.handleResize();
    this.resizeObserver.observe(this.historyImage.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
