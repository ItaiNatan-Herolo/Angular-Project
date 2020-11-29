// Imports
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, EventEmitter, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Component, Input, AfterViewInit, NgZone } from '@angular/core';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

//
// Class
export class TableComponent implements AfterViewInit, OnChanges {

  // Inputs
  @Input() items = [];
  @Input() headers = [];
  @Output() fetchMoreData = new EventEmitter();

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;
  loading = false;

  constructor(private ngZone: NgZone) { }

  //
  // LifeCycle
  ngOnChanges(changes: SimpleChanges): void {
    // set loading false after items change
    if (changes.items) {
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    // To detect the end of the scroll of the table
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 180)),
      throttleTime(200)
    ).subscribe(() => {
      // execute out of the ng-zone 
      this.ngZone.run(() => {
        this.loading = true;
        this.fetchMoreData.emit();
      })
    })
  }



}
