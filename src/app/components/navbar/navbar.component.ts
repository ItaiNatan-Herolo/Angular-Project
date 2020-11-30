import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
  <nav class="navbar">
    <h2>ironSource Assignment</h2>
  </nav>`,
  styles: [`
    nav.navbar {
      background-color: var(--navbar-bg-color);
      color: var(--color-primary);
      width: 100%;
      height: 50px;
      display: flex;
      margin: auto;
    }
    h2 {
      margin: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavbarComponent { }
