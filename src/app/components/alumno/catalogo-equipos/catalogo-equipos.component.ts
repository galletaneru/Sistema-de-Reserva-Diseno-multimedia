import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservasService } from '../solicitar-reserva/reservas.service';
import { Equipo } from '../../../shared/models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-catalogo-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-equipos.component.html',
  styleUrls: ['./catalogo-equipos.component.css']
})
export class CatalogoEquiposComponent {
  private reservas = inject(ReservasService);
  private router = inject(Router);
  private api = inject(AuthService);

  // ✅ Cargar equipos desde el servicio
  equipos = signal<Equipo[]>([]);
  categoriaSeleccionada = signal<string>('TODOS');
  carrito = signal<number[]>([]);
  busqueda = signal<string>('');

  // 🔹 Al iniciar, obtener equipos desde el servicio
  ngOnInit() {
    const token = localStorage.getItem('token') ?? '';
    this.api.getEquipos(token).subscribe({
      next: (data) => {
        this.equipos.set(data);
      },
      error: (err) => {
        console.error('❌ Error al obtener equipos:', err);
      },
    });
  }

  // ✅ Listado de categorías dinámico
  categorias = computed(() => {
    const cats = Array.from(new Set(this.equipos().map((e) => e.categoria)));
    return ['Todos', ...cats];
  });

  // ✅ Filtro combinado: categoría + búsqueda
  equiposFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const categoria = this.categoriaSeleccionada();
    return this.equipos().filter(e => {
      const coincideCategoria = categoria === 'TODOS' || e.categoria === categoria;
      const coincideTexto =
        e.nombre.toLowerCase().includes(texto) ||
        e.codigo.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });
  });
  

  // ✅ Cambiar categoría
  filtrarPorCategoria(cat: string) {
    this.categoriaSeleccionada.set(cat);
  }

  // ✅ Buscar por texto
  filtrarPorBusqueda(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.busqueda.set(input);
  }

  // ✅ Seleccionar o quitar equipo
  toggleEquipo(id: number) {
    const actual = this.carrito();
    this.carrito.set(
      actual.includes(id)
        ? actual.filter((x) => x !== id)
        : [...actual, id]
    );
  }

  // ✅ Saber si un equipo está en el carrito
  estaSeleccionado(id: number): boolean {
    return this.carrito().includes(id);
  }

  // ✅ Continuar hacia la vista de solicitud
  continuarReserva() {
    if (this.carrito().length === 0) {
      alert('⚠️ Debes seleccionar al menos un equipo antes de continuar.');
      return;
    }

    this.router.navigate(['/reservas/solicitar'], {
      state: { equiposSeleccionados: this.carrito() }
    });
  }
}
