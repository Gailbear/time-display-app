import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { RouterModule, provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';

const routes = [
  {
    path: '',
    component: AppComponent
  }
]

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class App {
}

bootstrapApplication(App,{ providers: [
  provideRouter(routes, withComponentInputBinding())
]});
