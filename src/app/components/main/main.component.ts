import { DataService } from './../../services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit, OnDestroy {

  public page = new BehaviorSubject<number>(1);
  public items = [];
  public headers = [];
  public filteredHeaders = []
  private $destroy: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private dataService: DataService) {
  }

  increment() {
    this.page.next(+1)
  }

  ngOnInit(): void {
    this.page.subscribe(counter => {
      this.dataService.getData(counter)
        .pipe(
          takeUntil(this.$destroy)
        )
        .subscribe(({ data }) => {
          this.items = data;
          this.headers = Object.keys(data[0]);
          this.filteredHeaders = this.headers.slice(0, 3);
        });
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


}
