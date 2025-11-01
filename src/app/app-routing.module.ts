import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarComponent } from './components/auth/recuperar/recuperar.component';
// import { CambiarContraseñaComponent } from './components/auth/cambiar-contraseña/cambiar-contraseña.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { CatalogoEquiposComponent } from './components/alumno/catalogo-equipos/catalogo-equipos.component';
import { SolicitarReservaComponent } from './components/alumno/solicitar-reserva/solicitar-reserva.component';
import { GestionEquiposComponent } from './components/admin/gestion-equipos/gestion-equipos.component';
import { GestionPacksComponent } from './components/admin/gestion-packs/gestion-packs.component';
import { GestionSancionesComponent } from './components/admin/gestion-sanciones/gestion-sanciones.component';
import { NotificacionesComponent } from './components/admin/notificaciones/notificaciones.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { HistorialSolicitudesComponent } from './components/admin/historial-solicitudes/historial-solicitudes.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/recuperar', component: RecuperarComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'auth/cambiar-contraseña', component: CambiarContraseñaComponent },
  { path: 'admin/dashboard', component: DashboardAdminComponent },
  { path: 'admin/equipos', component: GestionEquiposComponent },
  { path: 'admin/packs', component: GestionPacksComponent },
  { path: 'admin/sanciones', component: GestionSancionesComponent },
  { path: 'admin/notificaciones', component: NotificacionesComponent },
  { path: 'admin/solicitudes-historial', component: HistorialSolicitudesComponent },
  { path: 'equipos/catalogo', component: CatalogoEquiposComponent },
  { path: 'reservas/solicitar', component: SolicitarReservaComponent },
  { path: 'mis-solicitudes', loadComponent: () => import('./components/alumno/mis-solicitudes/mis-solicitudes.component').then(m => m.MisSolicitudesComponent) },
  { path: 'admin/gestionar', loadComponent: () => import('./components/alumno/gestionar-solicitudes/gestionar-solicitudes.component').then(m => m.GestionarSolicitudesComponent) },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
