import { DataService } from './../../services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Car {
  brand: string;
  model: string;
  year: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit, OnDestroy {

  public page = new BehaviorSubject<number>(1);

  public items = [];
  public filteredItems = [];

  public headers: Array<string> = [];
  public filteredHeaders: Array<string> = [];

  public filterBy = new BehaviorSubject<string>('');

  private $destroy: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private dataService: DataService) {
  }

  increment() {
    this.page.next(+1);
  }

  onFilterChange(e) {
    this.filterBy.next(e.target.value);
  }

  filterItemsBySearch() {
    if (!this.filterBy.value) {
      return this.items;
    }
    else {
      const filtered = this.items.filter(item => {
        return this.filteredHeaders.some(key => {
          return item[key].toLowerCase().includes(this.filterBy.value.toLowerCase());
        });
      });

      
    }
  }

  ngOnInit(): void {
    this.page.subscribe(counter => {
      this.dataService.getData(counter)
        .pipe(
          takeUntil(this.$destroy)
        )
        .subscribe(({ data }) => {
          this.items = data;
          this.filteredItems = this.filterItemsBySearch();
          this.headers = Object.keys(data[0]);
          this.filteredHeaders = this.headers.slice(0, 3);
        });
    });

    this.filterBy.subscribe(() => this.filterItemsBySearch());
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


}
