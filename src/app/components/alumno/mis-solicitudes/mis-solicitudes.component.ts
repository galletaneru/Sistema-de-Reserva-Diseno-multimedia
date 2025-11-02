import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../solicitar-reserva/reservas.service';
import { Equipo, Pack, TipoPrestamo } from '../../../shared/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent implements OnInit {
  private reservas = inject(ReservasService);
  private api = inject(AuthService);

  solicitudes: any[] = [];
  equipos: Equipo[] = [];
  packs: Pack[] = [];

  bloques = [
    { id: 1, texto: 'Bloque 1 (08:15 – 09:45)' },
    { id: 2, texto: 'Bloque 2 (09:55 – 11:25)' },
    { id: 3, texto: 'Bloque 3 (11:35 – 13:05)' },
    { id: 4, texto: 'Bloque 4 (14:30 – 16:00)' },
    { id: 5, texto: 'Bloque 5 (16:10 – 17:40)' }
  ];

  ngOnInit() {
    const token = localStorage.getItem('token') ?? '';
    this.api.getSolicitudesUsuario(token).subscribe({
      next: (data) => {
        this.solicitudes = data.map((s, index) => {
          const bloqueTxt =
            s.bloque_prestamo?.length > 0
              ? s.bloque_prestamo
                  .map((bp: any) => bp.bloque?.nombre || `Bloque ${bp.idBloque}`)
                  .join(', ')
              : '—';

          return {
            id: s.idPrestamo,
            tipo: s.tipo === 'DENTRO' ? 'Laboratorio' : 'Externo',
            fecha_inicio: s.fecha_inicio ?? '—',
            fecha_fin: s.fecha_fin ?? '—',
            bloqueTxt,
            equipos: [s.equipo?.nombre || '—'],
            observacion: s.Observacion ?? '',
            estado: s.estado?.toUpperCase() ?? 'PENDIENTE'
          };
        });
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
      },
    });
  }

}
