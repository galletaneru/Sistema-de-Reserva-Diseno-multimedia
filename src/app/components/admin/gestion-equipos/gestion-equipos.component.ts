import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Equipo {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  estado: string;
}

@Component({
  selector: 'app-gestion-equipos',
  templateUrl: './gestion-equipos.component.html',
  styleUrls: ['./gestion-equipos.component.css']
})
export class GestionEquiposComponent {
  equipos: Equipo[] = [
    { id: 1, codigo: 'EQ-001', nombre: 'Cámara Canon EOS R5', categoria: 'CÁMARA', estado: 'DISPONIBLE' },
    { id: 2, codigo: 'EQ-002', nombre: 'Micrófono Rode VideoMic', categoria: 'AUDIO', estado: 'DISPONIBLE' },
    { id: 3, codigo: 'EQ-003', nombre: 'Kit de Iluminación LED', categoria: 'ILUMINACIÓN', estado: 'RESERVADO' },
    { id: 4, codigo: 'EQ-004', nombre: 'Trípode Manfrotto', categoria: 'TRÍPODE', estado: 'DISPONIBLE' },
    { id: 5, codigo: 'EQ-005', nombre: 'Cámara Sony A7 III', categoria: 'CÁMARA', estado: 'MANTENIMIENTO' }
  ];

  mostrarModal = false;
  equipoSeleccionado: Equipo | null = null;
  equipoForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.equipoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^EQ-\d{3}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', Validators.required],
      estado: ['DISPONIBLE', Validators.required]
    });
  }

  abrirModalNuevo() {
    this.equipoSeleccionado = null;
    this.equipoForm.reset();
    this.equipoForm.patchValue({ estado: 'DISPONIBLE' });
    this.mostrarModal = true;
  }

  editarEquipo(equipo: Equipo) {
    this.equipoSeleccionado = equipo;
    this.equipoForm.patchValue(equipo);
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.equipoSeleccionado = null;
    this.equipoForm.reset();
  }

  guardarEquipo() {
    if (this.equipoForm.valid) {
      const formData = this.equipoForm.value;
      
      if (this.equipoSeleccionado) {
        // Editar equipo existente
        const index = this.equipos.findIndex(e => e.id === this.equipoSeleccionado!.id);
        if (index !== -1) {
          this.equipos[index] = { ...this.equipos[index], ...formData };
          alert('Equipo actualizado correctamente');
        }
      } else {
        // Crear nuevo equipo
        const nuevoEquipo: Equipo = {
          id: Math.max(...this.equipos.map(e => e.id)) + 1,
          ...formData
        };
        this.equipos.push(nuevoEquipo);
        alert('Equipo creado correctamente');
      }
      
      this.cerrarModal();
    }
  }

  eliminarEquipo(equipo: Equipo) {
    if (confirm(`¿Estás seguro de que quieres eliminar el equipo ${equipo.codigo}?`)) {
      const index = this.equipos.findIndex(e => e.id === equipo.id);
      if (index !== -1) {
        this.equipos.splice(index, 1);
        alert('Equipo eliminado correctamente');
      }
    }
  }

  volverDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}