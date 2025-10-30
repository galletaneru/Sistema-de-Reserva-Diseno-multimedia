import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarComponent } from './components/auth/recuperar/recuperar.component';
// import { CambiarContraseñaComponent } from './components/auth/cambiar-contraseña/cambiar-contraseña.component';
import { SolicitudEquipoComponent } from './components/alumno/solicitud-equipo/solicitud-equipo.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { GestionEquiposComponent } from './components/admin/gestion-equipos/gestion-equipos.component';
import { GestionPacksComponent } from './components/admin/gestion-packs/gestion-packs.component';
import { GestionSancionesComponent } from './components/admin/gestion-sanciones/gestion-sanciones.component';
import { NotificacionesComponent } from './components/admin/notificaciones/notificaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecuperarComponent,
    // CambiarContraseñaComponent,
    ResetPasswordComponent,
    SolicitudEquipoComponent,
    DashboardAdminComponent,
    GestionEquiposComponent,
    GestionPacksComponent,
    GestionSancionesComponent,
    NotificacionesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }