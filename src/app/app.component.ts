import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ironsource';
  numbers = [];

  constructor() {
    for (let i = 0; i < 1000; i++) {
      this.numbers.push(i);
    }
  }
}
