// Imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from './../../services/data.service';

//
// Interfaces
interface Item {
  id: string;
  title: string;
  picture: string;
  email: string;
  firstName: string;
  lastName: string;
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

  public selectBy = '';
  public filterBy = new BehaviorSubject<string>('');

  private $destroy: ReplaySubject<boolean> = new ReplaySubject(1);

  public loading = false;

  constructor(private dataService: DataService) {
  }


  //
  // Handlers
  setHeaderChecked(value, checked) {
    if (checked) {
      this.filteredHeaders = [...this.filteredHeaders, value];
    } else {
      this.filteredHeaders = this.filteredHeaders.filter(header => header !== value);
    }
  }

  filterItemsBySearch() {
    if (!this.filterBy.value) {
      return this.items;
    }
    else {

    }
  }

  fetchMoreData() {
    this.page.next(this.page.value + 1);
  }


  //
  // Events
  onFilterChange(e) {
    this.filterBy.next(e.target.value);
  }

  onSelect(e) {
    console.log(e)
  }


  //
  // LifeCycle
  ngOnInit(): void {
    this.loading = true;

    this.page.subscribe(counter => {
      this.dataService.getData(counter, this.selectBy, this.filterBy.value)
        .pipe(
          takeUntil(this.$destroy)
        )
        .subscribe((data) => {

          this.items = [...this.items, ...data];
          this.filteredItems = this.filterItemsBySearch();

          if (counter === 1) {
            this.filteredHeaders = Object.keys(data[0]).slice(0, 3);
            this.headers = Object.keys(data[0]).map(key => {
              return { key, value: key, checked: this.filteredHeaders.includes(key) }
            });
            this.loading = false;
          }

        });

    });

    this.filterBy.subscribe(() => this.filterItemsBySearch());
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


}
