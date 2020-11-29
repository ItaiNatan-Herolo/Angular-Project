// Imports
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ViewChild } from '@angular/core';
import { Component, Input, AfterViewInit, NgZone } from '@angular/core';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

//
// Class
export class TableComponent implements AfterViewInit {

  // Inputs
  @Input() items = [];
  @Input() headers = [];
  @Input() fetchMoreData;

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  constructor(private ngZone: NgZone) { }

  loading = false;

  //
  // LifeCycle
  ngAfterViewInit(): void {
    // To detect the end of the scroll of the table
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
        this.loading = true;
        this.fetchMoreData();
      })
    })
  }

}
