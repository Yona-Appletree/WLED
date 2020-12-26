import { Component, ElementRef, Input, OnDestroy } from "@angular/core";
import type { StrictModifiers } from '@popperjs/core';
import { createPopper, Instance, Placement, preventOverflow } from '@popperjs/core';
import { animationFramePromise } from "../../util/promise.util";


@Component({
	selector: 'wled-popup',
	templateUrl: './wled-popup.component.html',
	styleUrls: [ "./wled-popup.component.scss" ],
	host: {
		"[style.display]": "popupOpen ? '' : 'none'",
		"(window:click)": "handleWindowClick($event)"
	}
})
export class WledPopupComponent implements OnDestroy {
	private popper: Instance | null = null;

	@Input()
	popupTrigger: HTMLElement | null = null;

	@Input()
	placement: Placement = "bottom-start";

	@Input()
	closeOnOutsideClick = true;

	@Input()
	closeOnInsideClick = true;

	@Input()
	useTriggerWidth = true;

	popupOpen = false;

	/**
	 * Holds the position of the document scroll prior to opening the popup when not using popper (mobile full-screen)
	 * so it can be restored on close.
	 */
	preOpenScrollTop?: number;

	constructor(
		public elemRef: ElementRef<HTMLElement>
	) {}

	ngOnDestroy(): void {
		this.popper?.destroy();
	}

	private lastOpenedAtMs = 0;

	updatePopup(
		trigger: Event | HTMLElement | ElementRef<HTMLElement> | null = null,
		open = ! this.popupOpen,
	) {
		if (trigger instanceof Event) {
			this.popupTrigger = trigger.target as HTMLElement;
		}
		else if (trigger instanceof HTMLElement) {
			this.popupTrigger = trigger;
		}
		else if (trigger instanceof ElementRef && trigger.nativeElement) {
			this.popupTrigger = trigger.nativeElement as HTMLElement;
		}

		if (this.popupOpen == open) {
			return;
		}

		if (! open) {
			this.popupOpen = false;
			this.popper?.destroy();
			this.popper = null;

			if (this.preOpenScrollTop !== undefined) {
				const scrollTop = this.preOpenScrollTop;
				this.preOpenScrollTop = undefined;

				animationFramePromise().then(
					() => window.scrollTo({ top: scrollTop })
				);
			}
			return;
		}

		if (! this.popupTrigger) {
			return;
		}

		if (this.useTriggerWidth) {
			this.elemRef.nativeElement.style.width = this.popupTrigger.getBoundingClientRect().width + "px";
		} else {
			this.elemRef.nativeElement.style.width = "";
		}

		this.popupOpen = true;
		this.lastOpenedAtMs = Date.now();

		this.popper = createPopper<StrictModifiers>(
			this.popupTrigger,
			this.elemRef.nativeElement,
			{
				placement: "bottom-start",
				modifiers: [
					{
						name: 'preventOverflow',
					},
				]
			}
		);

		this.preOpenScrollTop = window.scrollY;
	}

	closePopup() {
		this.updatePopup(undefined, false);
	}

	handleWindowClick($event: MouseEvent) {
		if (! this.popupOpen) return;

		// Ignore window clicks close to when we were last opened. A hack, but it works well and is simpler than
		// the alternatives.
		if (Date.now() - this.lastOpenedAtMs < 50) {
			return;
		}

		const insideClick = this.elemRef.nativeElement.contains($event.target as Node);

		if (insideClick && this.closeOnInsideClick) {
			this.closePopup();
		}

		if (! insideClick && this.closeOnOutsideClick) {
			this.closePopup();
		}
	}
}

