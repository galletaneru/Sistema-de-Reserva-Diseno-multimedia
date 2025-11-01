import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface HistorialSolicitud {
  id: number;
  estudiante: string;
  email: string;
  asignatura: string;
  equipo: string;
  fecha: string; // ISO string
  estado: 'APROBADA' | 'RECHAZADA';
}

@Component({
  selector: 'app-historial-solicitudes',
  templateUrl: './historial-solicitudes.component.html',
  styleUrls: ['./historial-solicitudes.component.scss']
})
export class HistorialSolicitudesComponent {
  filtros: FormGroup;
  searchTerm = '';
  estados = ['APROBADA', 'RECHAZADA'];
  equipoOptions: string[] = [];
  asignaturaOptions: string[] = [];

  solicitudes: HistorialSolicitud[] = [
    { id: 1, estudiante: 'María González', email: 'maria@uta.cl', asignatura: 'Fotografía', equipo: 'Cámara Canon', fecha: '2025-10-01', estado: 'APROBADA' },
    { id: 2, estudiante: 'Carlos Rodríguez', email: 'carlos@uta.cl', asignatura: 'Audiovisual', equipo: 'Micrófono Shure', fecha: '2025-10-03', estado: 'RECHAZADA' },
    { id: 3, estudiante: 'Ana Martínez', email: 'ana@uta.cl', asignatura: 'Iluminación', equipo: 'Panel LED Neewer', fecha: '2025-10-05', estado: 'APROBADA' }
  ];

  constructor(private fb: FormBuilder) {
    this.filtros = this.fb.group({
      search: [''],
      fecha: [''],
      estado: ['']
    });

    // Construir opciones para autocompletar desde los datos
    this.equipoOptions = Array.from(new Set(this.solicitudes.map(s => s.equipo))).sort();
    this.asignaturaOptions = Array.from(new Set(this.solicitudes.map(s => s.asignatura))).sort();
  }

  get resultados(): HistorialSolicitud[] {
    const { search, fecha, estado } = this.filtros.value;
    return this.solicitudes.filter(s =>
      (!search ||
        s.equipo.toLowerCase().includes(search.toLowerCase()) ||
        s.asignatura.toLowerCase().includes(search.toLowerCase()) ||
        s.estudiante.toLowerCase().includes(search.toLowerCase())) &&
      (!fecha || s.fecha === fecha) &&
      (!estado || s.estado === estado)
    );
  }
}


