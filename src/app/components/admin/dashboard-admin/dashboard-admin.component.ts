import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SolicitudEquipo {
  id: number;
  estudiante: string;
  email: string;
  equipos: string[];
  fechaInicio: string;
  fechaFin: string;
  fechaSolicitud: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  motivoRechazo?: string;
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  seccionActiva: string = 'gestionar';
  mostrarModalDetalle = false;
  mostrarModalRechazo = false;
  solicitudDetalle: SolicitudEquipo | null = null;
  solicitudSeleccionada: SolicitudEquipo | null = null;
  motivoRechazo = '';

  solicitudes: SolicitudEquipo[] = [
    {
      id: 1,
      estudiante: 'María González',
      email: 'maria.gonzalez@example.com',
      equipos: ['Cámara Sony A6400', 'Trípode Manfrotto'],
      fechaInicio: '2024-01-15',
      fechaFin: '2024-01-20',
      fechaSolicitud: '2024-01-10',
      estado: 'PENDIENTE'
    },
    {
      id: 2,
      estudiante: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      equipos: ['Micrófono Rode', 'Laptop MacBook Pro'],
      fechaInicio: '2024-01-18',
      fechaFin: '2024-01-25',
      fechaSolicitud: '2024-01-12',
      estado: 'PENDIENTE'
    },
    {
      id: 3,
      estudiante: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      equipos: ['Tablet iPad Pro'],
      fechaInicio: '2024-01-05',
      fechaFin: '2024-01-10',
      fechaSolicitud: '2024-01-03',
      estado: 'APROBADA'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Por defecto mostrar la sección de gestionar
    this.seccionActiva = 'gestionar';
  }

  mostrarGestionar(): void {
    this.seccionActiva = 'gestionar';
  }

  mostrarSolicitudes(): void {
    this.seccionActiva = 'solicitudes';
  }

  abrirDetalleSolicitud(solicitud: SolicitudEquipo): void {
    this.solicitudDetalle = solicitud;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.solicitudDetalle = null;
  }

  aprobarSolicitud(solicitud: SolicitudEquipo, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (confirm(`¿Estás seguro de que quieres aprobar la solicitud de ${solicitud.estudiante}?`)) {
      solicitud.estado = 'APROBADA';
      this.cerrarModalDetalle();
      alert('✅ Solicitud aprobada exitosamente');
    }
  }

  rechazarSolicitud(solicitud: SolicitudEquipo, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.solicitudSeleccionada = solicitud;
    this.mostrarModalRechazo = true;
  }

  confirmarRechazo(): void {
    if (this.motivoRechazo.trim() === '') {
      alert('⚠️ Debes ingresar un motivo para rechazar la solicitud.');
      return;
    }
    if (this.solicitudSeleccionada) {
      this.solicitudSeleccionada.estado = 'RECHAZADA';
      this.solicitudSeleccionada.motivoRechazo = this.motivoRechazo;
      this.cerrarModal();
      this.cerrarModalDetalle();
      alert('❌ Solicitud rechazada exitosamente');
    }
  }

  cerrarModal(): void {
    this.mostrarModalRechazo = false;
    this.solicitudSeleccionada = null;
    this.motivoRechazo = '';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cerrarSesion(): void {
    if(confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.router.navigate(['/auth/login']);
    }
  }
}