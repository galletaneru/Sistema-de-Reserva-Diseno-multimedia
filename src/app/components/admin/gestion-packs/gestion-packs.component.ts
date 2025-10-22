import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Equipo {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
}

interface Pack {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  equipos: Equipo[];
}

@Component({
  selector: 'app-gestion-packs',
  templateUrl: './gestion-packs.component.html',
  styleUrls: ['./gestion-packs.component.css']
})
export class GestionPacksComponent {
  equiposDisponibles: Equipo[] = [
    { id: 1, codigo: 'EQ-001', nombre: 'Cámara Canon EOS R5', categoria: 'CÁMARA' },
    { id: 2, codigo: 'EQ-002', nombre: 'Micrófono Rode VideoMic', categoria: 'AUDIO' },
    { id: 3, codigo: 'EQ-003', nombre: 'Kit de Iluminación LED', categoria: 'ILUMINACIÓN' },
    { id: 4, codigo: 'EQ-004', nombre: 'Trípode Manfrotto', categoria: 'TRÍPODE' },
    { id: 5, codigo: 'EQ-005', nombre: 'Cámara Sony A7 III', categoria: 'CÁMARA' }
  ];

  packs: Pack[] = [
    {
      id: 1,
      nombre: 'Pack Básico de Video',
      descripcion: 'Equipos esenciales para grabación básica de video',
      activo: true,
      equipos: [
        { id: 1, codigo: 'EQ-001', nombre: 'Cámara Canon EOS R5', categoria: 'CÁMARA' },
        { id: 4, codigo: 'EQ-004', nombre: 'Trípode Manfrotto', categoria: 'TRÍPODE' }
      ]
    },
    {
      id: 2,
      nombre: 'Pack Profesional',
      descripcion: 'Kit completo para producción profesional',
      activo: true,
      equipos: [
        { id: 1, codigo: 'EQ-001', nombre: 'Cámara Canon EOS R5', categoria: 'CÁMARA' },
        { id: 2, codigo: 'EQ-002', nombre: 'Micrófono Rode VideoMic', categoria: 'AUDIO' },
        { id: 3, codigo: 'EQ-003', nombre: 'Kit de Iluminación LED', categoria: 'ILUMINACIÓN' },
        { id: 4, codigo: 'EQ-004', nombre: 'Trípode Manfrotto', categoria: 'TRÍPODE' }
      ]
    }
  ];

  mostrarModal = false;
  packSeleccionado: Pack | null = null;
  packForm: FormGroup;
  equiposSeleccionados: Equipo[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.packForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      activo: [true, Validators.required]
    });
  }

  abrirModalNuevo() {
    this.packSeleccionado = null;
    this.equiposSeleccionados = [];
    this.packForm.reset();
    this.packForm.patchValue({ activo: true });
    this.mostrarModal = true;
  }

  editarPack(pack: Pack) {
    this.packSeleccionado = pack;
    this.equiposSeleccionados = [...pack.equipos];
    this.packForm.patchValue(pack);
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.packSeleccionado = null;
    this.equiposSeleccionados = [];
    this.packForm.reset();
  }

  toggleEquipo(event: any, equipo: Equipo) {
    if (event.target.checked) {
      this.equiposSeleccionados.push(equipo);
    } else {
      const index = this.equiposSeleccionados.findIndex(e => e.id === equipo.id);
      if (index !== -1) {
        this.equiposSeleccionados.splice(index, 1);
      }
    }
  }

  isEquipoSeleccionado(equipo: Equipo): boolean {
    return this.equiposSeleccionados.some(e => e.id === equipo.id);
  }

  guardarPack() {
    if (this.packForm.valid && this.equiposSeleccionados.length > 0) {
      const formData = this.packForm.value;
      
      if (this.packSeleccionado) {
        // Editar pack existente
        const index = this.packs.findIndex(p => p.id === this.packSeleccionado!.id);
        if (index !== -1) {
          this.packs[index] = { 
            ...this.packs[index], 
            ...formData, 
            equipos: [...this.equiposSeleccionados] 
          };
          alert('Pack actualizado correctamente');
        }
      } else {
        // Crear nuevo pack
        const nuevoPack: Pack = {
          id: Math.max(...this.packs.map(p => p.id)) + 1,
          ...formData,
          equipos: [...this.equiposSeleccionados]
        };
        this.packs.push(nuevoPack);
        alert('Pack creado correctamente');
      }
      
      this.cerrarModal();
    } else if (this.equiposSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un equipo para el pack');
    }
  }

  eliminarPack(pack: Pack) {
    if (confirm(`¿Estás seguro de que quieres eliminar el pack "${pack.nombre}"?`)) {
      const index = this.packs.findIndex(p => p.id === pack.id);
      if (index !== -1) {
        this.packs.splice(index, 1);
        alert('Pack eliminado correctamente');
      }
    }
  }

  volverDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }
}