import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarComponent } from './components/auth/recuperar/recuperar.component';
// import { CambiarContraseñaComponent } from './components/auth/cambiar-contraseña/cambiar-contraseña.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { GestionEquiposComponent } from './components/admin/gestion-equipos/gestion-equipos.component';
import { GestionPacksComponent } from './components/admin/gestion-packs/gestion-packs.component';
import { GestionSancionesComponent } from './components/admin/gestion-sanciones/gestion-sanciones.component';
import { NotificacionesComponent } from './components/admin/notificaciones/notificaciones.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CatalogoEquiposComponent } from './components/alumno/catalogo-equipos/catalogo-equipos.component';
import { SolicitarReservaComponent } from './components/alumno/solicitar-reserva/solicitar-reserva.component';
import { HistorialSolicitudesComponent } from './components/admin/historial-solicitudes/historial-solicitudes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperarComponent,
    ResetPasswordComponent,
    // CambiarContraseñaComponent,
    DashboardAdminComponent,
    GestionEquiposComponent,
    GestionPacksComponent,
    GestionSancionesComponent,
    NotificacionesComponent,
    HistorialSolicitudesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NavbarComponent,
    CatalogoEquiposComponent,
    SolicitarReservaComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }