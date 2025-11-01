import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.showNavbar = this.shouldShowNavbar(evt.urlAfterRedirects || evt.url);
      }
    });
  }

  private shouldShowNavbar(url: string): boolean {
    // Mostrar navbar solo en rutas de alumno
    return url.startsWith('/equipos/')
      || url.startsWith('/reservas/')
      || url.startsWith('/mis-solicitudes');
  }
}
