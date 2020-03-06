/// <reference path="soho-menu-button.d.ts" />

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  NgZone,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'button[soho-menu-button]', // tslint:disable-line
  templateUrl: 'soho-menu-button.component.html',
  styleUrls: ['./soho-menu-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SohoMenuButtonComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @HostBinding('class.btn-menu') get isBtnMenu() { return true; }
  @HostBinding('attr.type') get buttonType() { return 'button'; }

  /** The underlying jQuery instance. */
  private jQueryElement: JQuery;

  /** The enterprise widget api. */
  private menuButton: SohoPopupMenuStatic;

  /** The button widget api */
  private button: SohoButtonStatic;

  // -------------------------------------------
  // Default options block
  // -------------------------------------------

  private options: SohoPopupMenuOptions = {};

  private buttonOptions: SohoButtonOptions = {};

  /**
   * Flag to force an update of the control after the view is created.
   */
  private runUpdatedOnCheck: boolean;

  // -------------------------------------------
  // Component Output
  // -------------------------------------------

  @Output() selected = new EventEmitter<SohoContextMenuEvent>();
  @Output() beforeopen = new EventEmitter<SohoContextMenuEvent>();
  // tslint:disable-next-line:no-output-rename
  @Output('open') open$ = new EventEmitter<SohoContextMenuEvent>();
  // tslint:disable-next-line:no-output-rename
  @Output('close') close$ = new EventEmitter<SohoContextMenuEvent>();

  // -------------------------------------------
  // Component Inputs
  // -------------------------------------------

  /** The icon to be used. */
  @Input() icon: string;

  @Input() set autoFocus(value: boolean) {
    this.options.autoFocus = value;
    if (this.menuButton) {
      this.menuButton.settings.autoFocus = value;
      this.markForRefresh();
    }
  }

  @Input() set mouseFocus(value: boolean) {
    this.options.mouseFocus = value;
    if (this.menuButton) {
      this.menuButton.settings.mouseFocus = value;
      this.markForRefresh();
    }
  }

  @Input() set showArrow(value: boolean) {
    this.options.showArrow = value;
    if (this.menuButton) {
      this.menuButton.settings.showArrow = value;
      this.markForRefresh();
    }
  }

  @Input() set returnFocus(value: boolean) {
    this.options.returnFocus = value;
    if (this.menuButton) {
      this.menuButton.settings.returnFocus = value;
      this.markForRefresh();
    }
  }

  @Input() set trigger(trigger: SohoPopupMenuTrigger) {
    this.options.trigger = trigger;
    if (this.menuButton) {
      this.menuButton.settings.trigger = trigger;
      this.markForRefresh();
    }
  }

  @Input() set menu(menu: string | JQuery<HTMLElement>) {
    this.options.menu = menu;
    if (this.menuButton) {
      this.menuButton.settings.menu = menu;
      this.markForRefresh();
    }
  }

  @Input() set ajaxBeforeOpenFunction(fn: AjaxBeforeOpenFunction) {
    this.options.beforeOpen = fn;
    if (this.menuButton) {
      this.menuButton.settings.beforeOpen = fn;
      // No update required.
    }
  }

  @Input() set hideMenuArrow(value: boolean) {
    this.buttonOptions.hideMenuArrow = value;
    if (this.button) {
      this.button.settings.hideMenuArrow = value;
      this.markForRefresh();
      // todo: menubutton.js updated() function doesn't seem to tear down the control and rebuild with new settings
    }
  }

  get hideMenuArrow(): boolean {
    return this.buttonOptions.hideMenuArrow;
  }

  @Input() set attachToBody(value: boolean) {
    this.options.attachToBody = value;
    if (this.menuButton) {
      this.menuButton.settings.attachToBody = value;
      this.markForRefresh();
    }
  }

  get attachToBody(): boolean {
    return this.options.attachToBody;
  }

  @Input() set removeOnDestroy(value: boolean) {
    this.options.removeOnDestroy = value;
    if (this.menuButton) {
      this.menuButton.settings.removeOnDestroy = value;
      this.markForRefresh();
    }
  }

  get removeOnDestroy(): boolean {
    return this.options.removeOnDestroy;
  }

  constructor(
    private element: ElementRef,
    private ref: ChangeDetectorRef,
    private ngZone: NgZone) { }

  ngAfterViewInit() {
    // call outside the angular zone so change detection
    // isn't triggered by the soho component.
    this.ngZone.runOutsideAngular(() => {

      // Wrap the element in a jQuery selector.
      this.jQueryElement = jQuery(this.element.nativeElement);

      // Initialise the soho-button widget.
      this.jQueryElement.button(this.buttonOptions);

      // Retrieve the soho button api.
      this.button = this.jQueryElement.data('button');

      // Initialise the SohoXi Control
      this.jQueryElement.popupmenu(this.options);

      // Retrieve the enterprise api
      this.menuButton = this.jQueryElement.data('popupmenu');

      // Initialize title attribute as a soho tooltip
      if (this.jQueryElement.has('[title]')) {
        this.jQueryElement.tooltip();
      }

      // Add listeners to emit events
      this.jQueryElement
      .on('selected', (e: JQuery.TriggeredEvent, args: JQuery) => this.onSelected(e, args))
      .on('beforeopen', (e: JQuery.TriggeredEvent, args: JQuery) => this.onBeforeOpen(e, args))
      .on('close', (e: JQuery.TriggeredEvent, args: JQuery) => this.onClose(e, args))
      .on('open', (e: JQuery.TriggeredEvent, args: JQuery) => this.onOpen(e, args));
    });
  }

  ngAfterViewChecked() {
    if (this.runUpdatedOnCheck) {
      this.ngZone.runOutsideAngular(() => {
        this.menuButton.updated();
        this.runUpdatedOnCheck = false;
      });
    }
  }

  private onSelected(e: JQuery.TriggeredEvent, args: JQuery) {
    this.ngZone.run(() => {
      this.selected.emit({ e, args });
    });
  }

  private onBeforeOpen(e: JQuery.TriggeredEvent, args: JQuery) {
    this.ngZone.run(() => {
      this.beforeopen.emit({ e, args });
    });
  }

  private onClose(e: JQuery.TriggeredEvent, args: JQuery) {
    this.ngZone.run(() => {
      this.close$.emit({ e, args });
    });
  }

  private onOpen(e: JQuery.TriggeredEvent, args: JQuery) {
    this.ngZone.run(() => {
      this.open$.emit({ e, args });
    });
  }

  updated() {
    this.ngZone.runOutsideAngular(() => {
      this.menuButton.updated();
    });
  }

  teardown() {
    this.ngZone.runOutsideAngular(() => {
      this.menuButton.teardown();
    });
  }

  public close(): void {
    this.ngZone.runOutsideAngular(() => {
      this.menuButton.close();
    });
  }

  public open(event: JQuery.TriggeredEvent, ajaxReturn?: boolean, useDelay?: boolean): void {
    this.ngZone.runOutsideAngular(() => {
      this.menuButton.open(event, ajaxReturn, useDelay);
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.jQueryElement) {
        // remove the event listeners on this element.
        this.jQueryElement.off();
      }

      // Destroy any widget resources.
      if (this.menuButton) {
        // @todo raise an issue on this failing on removeData!
        this.menuButton.destroy();
        this.menuButton = null;
      }

      if (this.button) {
        this.button.destroy();
        this.button = null;
      }
    });
  }

  /**
   * Marks the components as requiring a rebuild after the next update.
   */
  markForRefresh() {
    // Run updated on the next updated check.
    this.runUpdatedOnCheck = true;

    // ... make sure the change detector kicks in, otherwise if the inputs
    // were change programmatially the component may not be eligible for
    // updating.
    this.ref.markForCheck();
  }
}
