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

  public headers: Array<string> = [];
  public filteredHeaders: Array<string> = [];

  public filterBy = new BehaviorSubject<string>('');

  private $destroy: ReplaySubject<boolean> = new ReplaySubject(1);

  public loading = false;

  constructor(private dataService: DataService) {
  }


  //
  // Handlers
  onFilterChange(e) {
    this.filterBy.next(e.target.value);
  }

  filterItemsBySearch() {
    if (!this.filterBy.value) {
      return this.items;
    }
    else {

    }
  }

  fetchMoreData() {
    console.log(this.page)
    this.page.next(this.page.value + 1);
  }


  //
  // LifeCycle
  ngOnInit(): void {
    this.loading = true;

    this.page.subscribe(counter => {
      this.dataService.getData(counter)
        .pipe(
          takeUntil(this.$destroy)
        )
        .subscribe(({ data }) => {

          this.items = [...this.items, ...data];
          this.filteredItems = this.filterItemsBySearch();

          if (counter === 1) {
            this.headers = Object.keys(data[0]);
            this.filteredHeaders = this.headers.slice(0, 3);
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
