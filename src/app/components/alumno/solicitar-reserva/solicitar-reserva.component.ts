import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Equipo, User } from '../../../shared/models';


/** Validación: fecha fin >= inicio */
function rangoFechasValido(ctrl: AbstractControl) {
  const i = ctrl.get('fecha_inicio')?.value;
  const f = ctrl.get('fecha_fin')?.value;
  return i && f && new Date(i) > new Date(f) ? { rangoInvalido: true } : null;
}

/** Suma días hábiles */
function sumarDiasHabiles(fecha: Date, dias: number): Date {
  const result = new Date(fecha);
  let agregados = 0;
  while (agregados < dias) {
    result.setDate(result.getDate() + 1);
    const d = result.getDay();
    if (d !== 0 && d !== 6) agregados++;
  }
  return result;
}

/** Si cae en fin de semana, adelanta a lunes */
function ajustarSiFinDeSemana(fecha: Date): Date {
  const d = fecha.getDay();
  if (d === 6) fecha.setDate(fecha.getDate() + 2);
  if (d === 0) fecha.setDate(fecha.getDate() + 1);
  return fecha;
}

@Component({
  selector: 'app-solicitar-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-reserva.component.html',
  styleUrls: ['./solicitar-reserva.component.css'],
})
export class SolicitarReservaComponent {
  private fb = inject(FormBuilder);
  private api = inject(AuthService);
  

  usuarioActivo: any = null;
  equipos: Equipo[] = [];
  asignaturas: any[] = [];
  bloques: any[] = [];


  tipoSolicitud = signal<'DENTRO' | 'FUERA'>('DENTRO');
  mostrarMotivo = false;

  form = this.fb.group(
    {
      idUser: [null as number | null, Validators.required],
      nombre: [{ value: '', disabled: true }],
      rut: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      tipo_solicitud: ['DENTRO' as 'DENTRO' | 'FUERA', Validators.required],
      asignatura: ['', Validators.required],
      motivo: [''],
      equipos: [[] as number[]],
      observacion: [''],
      fecha_inicio: [''],
      fecha_fin: [''],
      bloques: [[] as number[]],
    },
    { validators: rangoFechasValido }
  );

  get f() {
    return this.form.controls;
  }

  esDentro = () => this.tipoSolicitud() === 'DENTRO';
  esFuera = () => this.tipoSolicitud() === 'FUERA';

  minFechaInicio = this.calcularMinFecha('DENTRO');

  calcularMinFecha(tipo: 'DENTRO' | 'FUERA'): string {
    const hoy = new Date();
    let fechaMin =
      tipo === 'FUERA'
        ? sumarDiasHabiles(hoy, 2)
        : new Date(hoy.getTime() + 2 * 24 * 60 * 60 * 1000);
    fechaMin = ajustarSiFinDeSemana(fechaMin);
    return fechaMin.toISOString().split('T')[0];
  }

  resumen = computed(() => {
    const v = this.form.getRawValue();
    const usuario = this.usuarioActivo?.persona?.Nombre || this.usuarioActivo?.name || '—';
    const tipo = v.tipo_solicitud ?? '—';
    const cantidadEquipos = (v.equipos ?? []).length;
    const periodo =
      v.fecha_inicio && v.fecha_fin
        ? `${v.fecha_inicio} → ${v.fecha_fin}`
        : '—';
    const bloquesTxt = this.bloques
      .filter((b) => (v.bloques ?? []).includes(b.id))
      .map((b) => b.texto)
      .join(', ');
    return { usuario, tipo, cantidadEquipos, periodo, bloquesTxt };
  });

  equiposSeleccionados = computed(() =>
    this.equipos.filter((e) =>
      this.form.get('equipos')!.value?.includes(e.idEquipo)
    )
  );

  ngOnInit() {
    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      alert('⚠️ No se encontró token. Inicia sesión.');
      return;
    }

    // 🔹 Traer usuario autenticado desde backend
    this.api.getUsuario(token).subscribe({
      next: (data) => {
        if (!data) {
        console.error('⚠️ Usuario vacío:', data);
        return;
      }

        this.usuarioActivo = data;
        this.form.patchValue({
          idUser: data.idUser,
          nombre: data.persona?.Nombre ?? '',
          rut: data.persona?.Rut ?? '',
          telefono: data.persona?.telefono ?? '',
          email: data.Email ?? '',
        });
      },
      error: (err) => {
        console.error('❌ Error al obtener usuario:', err);
        alert('Error al cargar datos del usuario.');
      },
    });

    // 🔹 Traer equipos (protegidos)
    this.api.getEquipos(token).subscribe({
      next: (data) => (this.equipos = data),
      error: (err) => console.error('❌ Error al cargar equipos:', err),
    });

    // 🔹 Recuperar equipos desde el catálogo
    const state = history.state as { equiposSeleccionados?: number[] };
    if (state?.equiposSeleccionados?.length) {
      this.form.patchValue({ equipos: state.equiposSeleccionados });
    }

    //  Cambios de tipo de solicitud
    this.form.get('tipo_solicitud')!.valueChanges.subscribe((tipo) => {
      const valor = (tipo ?? 'DENTRO') as 'DENTRO' | 'FUERA';
      this.tipoSolicitud.set(valor);
      this.minFechaInicio = this.calcularMinFecha(valor);
    });

    //  Cambios de asignatura
    this.api.getAsignaturas(token).subscribe({
      next: (data) => {
        this.asignaturas = [...data, { nombre: 'OTROS' }];
        console.log(' Asignaturas cargadas:', this.asignaturas);
      },
      error: (err) => {
        console.error(' Error al cargar asignaturas:', err);
      },
    });
    //Cargar bloques desde backend
    this.api.getBloques(token).subscribe({
      next: (data) => {
        this.bloques = data.map((b) => ({
          id: b.idBloque,
          texto: `Bloque ${b.idBloque} (${b.hora_inicio} – ${b.hora_fin})`
        }));
        console.log(' Bloques cargados:', this.bloques);
      },
      error: (err) => console.error(' Error al cargar bloques:', err),
    });

  }

  //  Método necesario para el HTML
  onAsignaturaChange(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.mostrarMotivo = valor === 'OTROS';
  }

  //  Checkboxes de bloques
  onBloqueChange(event: Event, id: number) {
    const target = event.target as HTMLInputElement;
    const arr: number[] = this.form.get('bloques')!.value ?? [];
    if (target.checked) {
      if (!arr.includes(id)) this.form.get('bloques')!.setValue([...arr, id]);
    } else {
      this.form.get('bloques')!.setValue(arr.filter((x) => x !== id));
    }
    this.form.get('bloques')!.markAsDirty();
    this.form.get('bloques')!.updateValueAndValidity();
  }

  //  Envío real al backend
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const equiposSeleccionados = (this.form.get('equipos')!.value ?? []).map(
      (x: any) => Number(x)
    );

    const payload = {
      idUser: this.form.get('idUser')!.value,
      equipos: equiposSeleccionados,
      tipo: this.form.get('tipo_solicitud')!.value ?? 'DENTRO',
      asignatura: this.form.get('asignatura')!.value ?? '',
      motivo: this.form.get('motivo')!.value ?? '',
      observacion: this.form.get('observacion')!.value ?? '',
      fecha_inicio: this.form.get('fecha_inicio')!.value ?? '',
      fecha_fin: this.form.get('fecha_fin')!.value ?? '',
      bloques: this.form.get('bloques')!.value ?? [],
    };

    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      alert('⚠️ No se encontró token. Inicia sesión.');
      return;
    }
    console.log(payload);

    this.api.crearPrestamo(payload, token).subscribe({
      next: (resp) => {
        console.log('✅ Préstamo creado:', resp);
        alert('✅ Solicitud enviada correctamente al backend.');
        this.limpiar();
      },
      error: (err) => {
        console.error('❌ Error al crear préstamo:', err);
        alert('Error al crear préstamo. Revisa consola.');
      },
    });
  }

  limpiar() {
    this.form.reset({
      tipo_solicitud: 'DENTRO',
      equipos: [],
      bloques: [],
      fecha_inicio: '',
      fecha_fin: '',
      asignatura: '',
      motivo: '',
      observacion: '',
    });
    this.tipoSolicitud.set('DENTRO');
    this.minFechaInicio = this.calcularMinFecha('DENTRO');
    this.mostrarMotivo = false;
  }
}
