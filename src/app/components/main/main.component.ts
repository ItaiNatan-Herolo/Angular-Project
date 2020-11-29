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
  styleUrls: ['./main.component.scss']
})

//
// Class
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

  @ViewChild('input') input: ElementRef;

  //
  // API
  getItems(filterSearch: boolean = false) {
    if (this.page.value === 1) {
      this.loadingPage = true;
    }

    this.dataService.getData(this.page.value, this.selectBy.value, this.filterBy.value)
      .pipe(
        takeUntil(this.$destroy)
      )
      .subscribe((data: Array<Item>) => {

        if (filterSearch) {
          this.filteredItems = [...data];
        } else {
          this.items = [...this.items, ...data];
          this.filteredItems = [...this.items];
        }

        if (this.page.value === 1 && data.length) {
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
  setHeaderChecked(value: String, checked: String) {
    if (checked) {
      this.filteredHeaders = [...this.filteredHeaders, value];
    } else {
      this.filteredHeaders = this.filteredHeaders.filter(header => header !== value);
    }
  }

  filterItems() {
    if (this.filterBy.value && this.selectBy.value) {
      this.getItems(true);
    } else {
      this.filteredItems = this.items;
    }
  }

  fetchMoreData() {
    this.page.next(this.page.value + 1);
  }

  //
  // Events
  onFilterChange(e) {
    const query = e?.target?.value ?? e;
    this.filterBy.next(query);
  }

  onSelect(e) {
    this.selectBy.next(e.value);
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
