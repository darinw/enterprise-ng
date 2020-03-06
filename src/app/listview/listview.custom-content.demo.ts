import {
  Component,
  OnInit,
  ViewChild
 } from '@angular/core';

 import {
   SohoListViewComponent
 } from 'ids-enterprise-ng';

// @ts-ignore
@Component({
  selector: 'app-listview-custom-content-demo',
  templateUrl: 'listview.custom-content.demo.html',
})
export class ListViewCustomContentDemoComponent implements OnInit {

  @ViewChild(SohoListViewComponent, { static: true }) sohoListViewComponent: SohoListViewComponent;
  data1 = ['ONE', 'TWO', 'THREE'];
  data2 = ['Four', 'FIVE', 'SIX', 'SEVEN'];
  data = this.data1;

  ngOnInit() {
    this.makeSingleSelection();
  }
  changeToDataSet1() {
    this.data = this.data1;
  }
  changeToDataSet2() {
    this.data = this.data2;
  }
  makeMultipleSelection() {
    this.sohoListViewComponent.selectable = 'multiple';
  }
  makeSingleSelection() {
    this.sohoListViewComponent.selectable = 'single';
  }
  makeMixedSelection() {
    this.sohoListViewComponent.selectable = 'mixed';
  }
}
