import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarComponent } from './components/auth/recuperar/recuperar.component';
// import { CambiarContraseñaComponent } from './components/auth/cambiar-contraseña/cambiar-contraseña.component';
import { SolicitudEquipoComponent } from './components/alumno/solicitud-equipo/solicitud-equipo.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { GestionEquiposComponent } from './components/admin/gestion-equipos/gestion-equipos.component';
import { GestionPacksComponent } from './components/admin/gestion-packs/gestion-packs.component';
import { GestionSancionesComponent } from './components/admin/gestion-sanciones/gestion-sanciones.component';
import { NotificacionesComponent } from './components/admin/notificaciones/notificaciones.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/recuperar', component: RecuperarComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'auth/cambiar-contraseña', component: CambiarContraseñaComponent },
  { path: 'alumno/solicitud-equipo', component: SolicitudEquipoComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/equipos', component: GestionEquiposComponent },
  { path: 'admin/packs', component: GestionPacksComponent },
  { path: 'admin/sanciones', component: GestionSancionesComponent },
  { path: 'admin/notificaciones', component: NotificacionesComponent },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
