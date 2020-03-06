import {
  Component,
  ViewChild,
} from '@angular/core';
import { CalendarDemoService } from './calendar.demo.service';
import { SohoCalendarComponent } from 'ids-enterprise-ng';

@Component({
  selector: 'app-calendar-legend-demo',
  templateUrl: 'calendar-legend.demo.html',
  providers: [CalendarDemoService]
})
export class CalendarLegendDemoComponent {

  @ViewChild('SohoCalendarComponent') sohoCalendarComponent: SohoCalendarComponent;

  public initialMonth = 11;
  public initialYear = 2018;
  public showViewChanger = true;
  public eventTypes: [];
  public events: [];

  constructor(private monthViewService: CalendarDemoService) { }

  public onRenderMonthCallback = (node: Node, response: Function) => {
    this.monthViewService.getCalendarEventTypes().subscribe((types) => {
      this.monthViewService.getCalendarEvents().subscribe((events) => {
        this.eventTypes = types;
        this.events = events;
        response(this.events, this.eventTypes);
      });
    });
  }

  public onCalendarDateSelectedCallback = (node: Node, args: SohoCalendarDateSelectedEvent) => {
    console.log('onCalendarEventSelectedCallback', args);
  }
}
