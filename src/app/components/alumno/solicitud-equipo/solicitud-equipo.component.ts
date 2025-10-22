import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

interface Equipo { 
  id: number; 
  codigo: string; 
  nombre: string; 
  categoria: string; 
  estado: 'DISPONIBLE'|'RESERVADO'; 
}

interface EquipoSeleccionado {
  equipo: Equipo;
  cantidad: number;
}

@Component({
  selector: 'app-solicitud-equipo',
  templateUrl: './solicitud-equipo.component.html',
  styleUrls: ['./solicitud-equipo.component.css']
})
export class SolicitudEquipoComponent {
  equipos: Equipo[] = [
    { id:1, codigo:'EQ-001', nombre:'Cámara Sony A6400', categoria:'Audiovisual', estado:'DISPONIBLE' },
    { id:2, codigo:'EQ-002', nombre:'Trípode Manfrotto',  categoria:'Accesorios',  estado:'DISPONIBLE' },
    { id:3, codigo:'EQ-003', nombre:'Micrófono Rode', categoria:'Audio', estado:'DISPONIBLE' },
    { id:4, codigo:'EQ-004', nombre:'Laptop MacBook Pro', categoria:'Computación', estado:'DISPONIBLE' },
    { id:5, codigo:'EQ-005', nombre:'Tablet iPad Pro', categoria:'Computación', estado:'RESERVADO' }
  ];

  form: FormGroup;
  today: string;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ){
    // Establecer fecha mínima como hoy
    this.today = new Date().toISOString().split('T')[0];
    
    this.form = this.fb.group({
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      equipos: this.fb.array([])
    });
    
    // Inicializar FormArray con todos los equipos
    this.equipos.forEach(e => 
      this.equiposFA.push(this.fb.group({ 
        equipoId: [e.id], 
        cantidad: [0, [Validators.min(0), Validators.max(5)]] 
      }))
    );
  }

  get equiposFA(){ return this.form.get('equipos') as FormArray; }

  getSelectedEquipos(): EquipoSeleccionado[] {
    const equiposSeleccionados: EquipoSeleccionado[] = [];
    
    this.equiposFA.value.forEach((item: any, index: number) => {
      if (item.cantidad > 0) {
        const equipo = this.equipos.find(e => e.id === item.equipoId);
        if (equipo && equipo.estado === 'DISPONIBLE') {
          equiposSeleccionados.push({
            equipo: equipo,
            cantidad: item.cantidad
          });
        }
      }
    });
    
    return equiposSeleccionados;
  }

  isFormValid(): boolean {
    const hasSelectedEquipos = this.getSelectedEquipos().length > 0;
    const fechaInicio = this.form.get('fecha_inicio')?.value;
    const fechaFin = this.form.get('fecha_fin')?.value;
    
    // Validar que las fechas estén completas y sean válidas
    const hasValidDates = fechaInicio && fechaFin;
    const datesValid = hasValidDates && new Date(fechaFin) >= new Date(fechaInicio);
    
    return hasSelectedEquipos && hasValidDates && datesValid;
  }

  limpiarFormulario(): void {
    this.form.reset();
    this.equiposFA.controls.forEach(control => {
      control.get('cantidad')?.setValue(0);
    });
  }

  enviar(){
    // Verificar si hay equipos reservados seleccionados
    const equiposReservadosSeleccionados = this.equiposFA.value.filter((item: any) => {
      if (item.cantidad > 0) {
        const equipo = this.equipos.find(e => e.id === item.equipoId);
        return equipo && equipo.estado === 'RESERVADO';
      }
      return false;
    });

    if (equiposReservadosSeleccionados.length > 0) {
      alert('⚠️ No puedes solicitar equipos que están reservados. Por favor selecciona solo equipos disponibles.');
      return;
    }

    if (!this.isFormValid()) {
      if (!this.getSelectedEquipos().length) {
        alert('⚠️ Por favor selecciona al menos 1 equipo disponible');
        return;
      }
      if (!this.form.get('fecha_inicio')?.valid || !this.form.get('fecha_fin')?.valid) {
        alert('⚠️ Por favor completa las fechas correctamente');
        return;
      }
      const fechaInicio = this.form.get('fecha_inicio')?.value;
      const fechaFin = this.form.get('fecha_fin')?.value;
      if (new Date(fechaFin) < new Date(fechaInicio)) {
        alert('⚠️ La fecha de fin debe ser posterior a la fecha de inicio');
        return;
      }
      return;
    }

    const dto = {
      equipos: this.getSelectedEquipos(),
      fecha_inicio: this.form.value.fecha_inicio,
      fecha_fin: this.form.value.fecha_fin,
      fecha_solicitud: new Date().toISOString(),
      estado: 'PENDIENTE'
    };

    console.log('🎬 Solicitud de equipos:', dto);
    
    // Simular envío exitoso
    alert(`✅ Solicitud enviada exitosamente!\n\n📋 Equipos solicitados: ${dto.equipos.length}\n📅 Período: ${dto.fecha_inicio} - ${dto.fecha_fin}`);
    
    // Limpiar formulario después del envío
    this.limpiarFormulario();
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.router.navigate(['/auth/login']);
    }
  }
}
