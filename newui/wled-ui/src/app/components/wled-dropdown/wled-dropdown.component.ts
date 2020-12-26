import { Component, ElementRef, Input, OnDestroy } from "@angular/core";
import type { StrictModifiers } from '@popperjs/core';
import { createPopper, Instance, Placement } from '@popperjs/core';


@Component({
	selector: 'wled-dropdown',
	templateUrl: './wled-dropdown.component.html',
	styleUrls: [ "./wled-dropdown.component.scss" ],
	host: {
		"[style.display]": "popupOpen ? '' : 'none'",
		"(window:click)": "handleWindowClick($event)"
	}
})
export class WledDropdownComponent implements OnDestroy {
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

		this.popper = createPopper<StrictModifiers>(
			this.popupTrigger,
			this.elemRef.nativeElement,
			{
				placement: "bottom-start"
			}
		);

		this.popupOpen = true;
		this.lastOpenedAtMs = Date.now();
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

