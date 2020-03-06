/// <reference path="soho-column.d.ts" />

import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';

@Component({
  selector: '[soho-column]', // tslint:disable-line
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SohoColumnComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  /** Options. */
  private options: SohoColumnOptions = {};

  @HostBinding('class.chart-container') get isColumn() {
    return true;
  }

  /** Defines the data to use, must be specified for this component. */
  @Input() set dataset(dataset: Array<any>) {
    this.options.dataset = dataset;

    if (this.column) {
      this.column.settings.dataset = dataset;
      this.updateRequired = true;
    }
  }

   /** Chart Type */
  @Input() set type(value: SohoColumnType) {
    this.options.type = value;

    if (this.column) {
      this.column.settings.type = value;
      this.updateRequired = true;
    }
  }

  /** Default is a single or stacked chart. */
  @Input() set isStacked(value: boolean) {
    this.options.isStacked = value;

    if (this.column) {
      this.column.settings.isStacked = value;
      this.updateRequired = true;
    }
  }

  /** If false the legend will not be shown. */
  @Input() set showLegend(value: boolean) {
    this.options.showLegend = value;

    if (this.column) {
      this.column.settings.showLegend = value;
      this.updateRequired = true;
    }
  }

  /** true|false - will do or not do the animation, 'initial' will do only first time the animation. */
  @Input() set animate(value: boolean) {
    this.options.animate = value;

    if (this.column) {
      this.column.settings.animate = value;
      this.updateRequired = true;
    }
  }

  /** If true, the component will not resize when resizing the page. */
  @Input() set redrawOnResize(value: boolean) {
    this.options.redrawOnResize = value;

    if (this.column) {
      this.column.settings.redrawOnResize = value;
      this.updateRequired = true;
    }
  }

  /** The d3 axis format. */
  @Input() set format(value: string) {
    this.options.format = value;

    if (this.column) {
      this.column.settings.format = value;
      this.updateRequired = true;
    }
  }

  @Input() set formatterString(value: string) {
    this.options.formatterString = value;

    if (this.column) {
      this.column.settings.formatterString = value;
      this.updateRequired = true;
    }
  }

  /** Settings for the chart ticks. Can set ticks: {format: d3Format, number: n} */
  @Input() set ticks(value: object) {
    this.options.ticks = value;

    if (this.column) {
      this.column.settings.ticks = value;
      this.updateRequired = true;
    }
  }

  /** An empty message will be displayed when there is no chart data. */
  @Input() set emptyMessage(value: SohoEmptyMessageOptions) {
    this.options.emptyMessage = value;

    if (this.column) {
      this.column.settings.emptyMessage = value;
      this.updateRequired = true;
    }
  }

  /** Settings for the chart xAxis. */
  @Input() set xAxis(value: object) {
    this.options.xAxis = value;

    if (this.column) {
      this.column.settings.xAxis = value;
      this.updateRequired = true;
    }
  }

  /** Settings for the chart yAxis. */
  @Input() set yAxis(value: object) {
    this.options.yAxis = value;

    if (this.column) {
      this.column.settings.yAxis = value;
      this.updateRequired = true;
    }
  }

  /** Settings for the chart tooltip. */
  @Input() set tooltip(tooltip: string | SohoColumnTooltipFunction) {
    this.options.tooltip = tooltip;

    if (this.column) {
      this.column.settings.tooltip = tooltip;
      this.updateRequired = true;
    }
  }

  /** Events */
  @Output() selected: EventEmitter<SohoColumnSelectEvent> = new EventEmitter<SohoColumnSelectEvent>();
  @Output() unselected: EventEmitter<SohoColumnSelectEvent> = new EventEmitter<SohoColumnSelectEvent>();
  @Output() rendered: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() contextmenu: EventEmitter<Object> = new EventEmitter<Object[]>();

  private jQueryElement: JQuery;
  public column: SohoColumn;
  private updateRequired = false;

  constructor(
    private element: ElementRef,
    private ngZone: NgZone,
  ) { }

  /** Setup */
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.jQueryElement = jQuery(this.element.nativeElement);

      this.jQueryElement.chart(this.options);
      this.column = this.jQueryElement.data('column');

      // Setup the events
      this.jQueryElement.on('selected', (e: any, args: SohoColumnSelectEvent) =>
        this.ngZone.run(() => this.selected.emit(args)));
      this.jQueryElement.on('unselected', (e: any, args: SohoColumnSelectEvent) =>
        this.ngZone.run(() => this.unselected.emit(args)));
      this.jQueryElement.on('rendered', (...args) =>
        this.ngZone.run(() => this.rendered.emit(args)));
      this.jQueryElement.on('contextmenu', (...args) =>
        this.ngZone.run(() => this.contextmenu.emit(args)));
    });
  }

  ngAfterViewChecked() {
    if (this.column && this.updateRequired) {
      this.ngZone.runOutsideAngular(() => this.column.updated(this.column.settings));
      this.updateRequired = false;
    }
  }

  /** Tear Down */
  ngOnDestroy() {
    // call outside the angular zone so change detection isn't triggered by the soho component.
    this.ngZone.runOutsideAngular(() => {
      if (this.jQueryElement) {
        this.jQueryElement.off();
      }
      if (this.column) {
        this.column.destroy();
        this.column = null;
      }
    });
  }

  public setSelected(selected: SohoColumnSelected) {
    this.ngZone.runOutsideAngular(() => this.column.setSelected(selected));
  }

  public toggleSelected(selected: SohoColumnSelected) {
    this.ngZone.runOutsideAngular(() => this.column.toggleSelected(selected));
  }

  public getSelected() {
    return this.ngZone.runOutsideAngular(() => this.column.getSelected());
  }
}
