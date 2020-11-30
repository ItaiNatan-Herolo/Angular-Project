// Imports
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from './../../services/data.service';
import { debounce } from 'lodash';

//
// Interfaces
interface Item {
  id: string;
  age: number;
  company: string;
  email: string;
  name: string;
  phone: string;
  region: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

//
// Class - the main page
export class MainComponent implements OnInit, OnDestroy {

  public page = new BehaviorSubject<number>(1);

  public items: Array<Item> = [];
  public filteredItems: Array<Item> = [];

  public headers = [];
  public filteredHeaders = [];

  public selectBy = new BehaviorSubject<string>('');
  public filterBy = new BehaviorSubject<string>('');

  private $destroy: ReplaySubject<boolean> = new ReplaySubject(1);

  public loadingPage = false;

  constructor(private dataService: DataService) {
    this.onFilterChange = debounce(this.onFilterChange, 300);
  }

  //
  // API
  getItems(isFilterSearch: boolean = false) {

    // set loading only on the initial page
    if (this.page.value === 1 && !isFilterSearch) {
      this.loadingPage = true;
    }

    const page: number = isFilterSearch ? 1 : this.page.value;

    // api request
    this.dataService.getData(page, this.selectBy.value, this.filterBy.value)
      .pipe(
        takeUntil(this.$destroy)
      )
      .subscribe((data: Array<Item>) => {

        // save the data
        if (isFilterSearch) {
          this.filteredItems = [...data];
        } else {
          this.items = [...this.items, ...data];
          this.filteredItems = [...this.items];
        }

        // set the headers table
        if (this.page.value === 1 && data.length && !isFilterSearch) {
          this.filteredHeaders = Object.keys(data[0]).slice(0, 3);
          this.headers = Object.keys(data[0]).map(key => {
            return { key, value: key, checked: this.filteredHeaders.includes(key) }
          });
        }

        this.loadingPage = false;
      });
  }

  //
  // Handlers
  filterItems() {
    // function for set data on filtered by queries or not
    if (this.filterBy.value && this.selectBy.value) {
      this.getItems(true);
    } else {
      this.filteredItems = this.items;
    }
  }

  fetchMoreData() {
    // the function for sending to table to get more data on scroll
    this.page.next(this.page.value + 1);
  }

  //
  // Events
  onFilterChange(e) {
    // save the value from the input
    const query = e?.target?.value ?? e;
    this.filterBy.next(query);
  }

  onSelect(e) {
    // save the value from the select
    this.selectBy.next(e.value);
  }

  setHeaderChecked(value: String, checked: String) {
    // save the values from the checkbox
    if (checked) {
      this.filteredHeaders = [...this.filteredHeaders, value];
    } else {
      this.filteredHeaders = this.filteredHeaders.filter(header => header !== value);
    }
  }

  //
  // LifeCycle
  ngOnInit(): void {
    this.page.subscribe(() => this.getItems());

    this.filterBy.subscribe(() => this.filterItems());

    this.selectBy.subscribe(() => this.filterItems());
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

}
