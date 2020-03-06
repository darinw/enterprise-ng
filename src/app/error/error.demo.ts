import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SohoErrorDirective
} from 'ids-enterprise-ng';

/**
 * This example:
 * - shows basic error functionality on input elements with an angular template
 */
@Component({
  selector: 'app-error-demo',
  templateUrl: 'error.demo.html'
})
export class ErrorDemoComponent {
  @ViewChild(SohoErrorDirective, { static: true }) public error: SohoErrorDirective; // tslint:disable-line

  // tslint:disable-next-line:no-unused-variable
  public message = 'Field is required';

}
