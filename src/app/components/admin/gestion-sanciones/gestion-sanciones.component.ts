import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Usuario {
  nombre: string;
  email: string;
}

interface Sancion {
  id: number;
  usuario: string;
  email: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  nivel: string;
  estado: string;
}

@Component({
  selector: 'app-gestion-sanciones',
  templateUrl: './gestion-sanciones.component.html',
  styleUrls: ['./gestion-sanciones.component.css']
})
export class GestionSancionesComponent {
  usuarios: Usuario[] = [
    { nombre: 'Juan Pérez', email: 'juan.perez@estudiante.com' },
    { nombre: 'María García', email: 'maria.garcia@estudiante.com' },
    { nombre: 'Carlos López', email: 'carlos.lopez@estudiante.com' },
    { nombre: 'Ana Martínez', email: 'ana.martinez@estudiante.com' }
  ];

  sanciones: Sancion[] = [
    {
      id: 1,
      usuario: 'Juan Pérez',
      email: 'juan.perez@estudiante.com',
      descripcion: 'No devolvió el equipo en la fecha acordada',
      fechaInicio: new Date('2024-01-15'),
      fechaFin: new Date('2024-02-15'),
      nivel: 'MEDIA',
      estado: 'ACTIVA'
    },
    {
      id: 2,
      usuario: 'María García',
      email: 'maria.garcia@estudiante.com',
      descripcion: 'Equipo devuelto en mal estado',
      fechaInicio: new Date('2024-01-10'),
      fechaFin: new Date('2024-01-25'),
      nivel: 'LEVE',
      estado: 'FINALIZADA'
    },
    {
      id: 3,
      usuario: 'Carlos López',
      email: 'carlos.lopez@estudiante.com',
      descripcion: 'Pérdida de equipo asignado',
      fechaInicio: new Date('2024-01-20'),
      fechaFin: new Date('2024-04-20'),
      nivel: 'GRAVE',
      estado: 'ACTIVA'
    }
  ];

  mostrarModal = false;
  sancionSeleccionada: Sancion | null = null;
  sancionForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.sancionForm = this.fb.group({
      usuario: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      nivel: ['LEVE', Validators.required],
      estado: ['ACTIVA', Validators.required]
    });
  }

  abrirModalNueva() {
    this.sancionSeleccionada = null;
    this.sancionForm.reset();
    this.sancionForm.patchValue({ 
      nivel: 'LEVE',
      estado: 'ACTIVA',
      fechaInicio: new Date().toISOString().split('T')[0]
    });
    this.mostrarModal = true;
  }

  editarSancion(sancion: Sancion) {
    this.sancionSeleccionada = sancion;
    this.sancionForm.patchValue({
      usuario: sancion.email,
      descripcion: sancion.descripcion,
      fechaInicio: sancion.fechaInicio.toISOString().split('T')[0],
      fechaFin: sancion.fechaFin.toISOString().split('T')[0],
      nivel: sancion.nivel,
      estado: sancion.estado
    });
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.sancionSeleccionada = null;
    this.sancionForm.reset();
  }

  onUsuarioChange(event: any) {
    const email = event.target.value;
    const usuario = this.usuarios.find(u => u.email === email);
    if (usuario) {
      // Actualizar el nombre del usuario en el formulario si es necesario
    }
  }

  guardarSancion() {
    if (this.sancionForm.valid) {
      const formData = this.sancionForm.value;
      const usuarioSeleccionado = this.usuarios.find(u => u.email === formData.usuario);
      
      if (!usuarioSeleccionado) {
        alert('Usuario no encontrado');
        return;
      }

      const sancionData = {
        ...formData,
        usuario: usuarioSeleccionado.nombre,
        email: usuarioSeleccionado.email,
        fechaInicio: new Date(formData.fechaInicio),
        fechaFin: new Date(formData.fechaFin)
      };
      
      if (this.sancionSeleccionada) {
        // Editar sanción existente
        const index = this.sanciones.findIndex(s => s.id === this.sancionSeleccionada!.id);
        if (index !== -1) {
          this.sanciones[index] = { ...this.sanciones[index], ...sancionData };
          alert('Sanción actualizada correctamente');
        }
      } else {
        // Crear nueva sanción
        const nuevaSancion: Sancion = {
          id: Math.max(...this.sanciones.map(s => s.id)) + 1,
          ...sancionData
        };
        this.sanciones.push(nuevaSancion);
        alert('Sanción creada correctamente');
      }
      
      this.cerrarModal();
    }
  }

  eliminarSancion(sancion: Sancion) {
    if (confirm(`¿Estás seguro de que quieres eliminar la sanción de ${sancion.usuario}?`)) {
      const index = this.sanciones.findIndex(s => s.id === sancion.id);
      if (index !== -1) {
        this.sanciones.splice(index, 1);
        alert('Sanción eliminada correctamente');
      }
    }
  }

  volverDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}