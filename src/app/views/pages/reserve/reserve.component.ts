import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../../../core/services/reserve.service';
import { Reserve } from '../../../models/reserve.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.scss'],
  imports: [
    NgClass,
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  providers: [ReserveService, HttpClient],
  standalone: true,
})
export class ReserveComponent implements OnInit {
  reserves: any[] = [];
  selectedReserve: any | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  loading: boolean = false;
  showModal: boolean = false;

  constructor(private reserveService: ReserveService) {}

  ngOnInit(): void {
    this.loadReserves();
  }

  loadReserves(): void {
    this.loading = true;
    this.reserveService.getReserves(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.reserves = response.data.rows;
          this.totalRecords = response.data.count;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.loading = false;
      },
    });
  }

  approveReserve(id: number): void {
    if (confirm('¿Está seguro de aprobar esta reserva?')) {
      this.reserveService.approveReserve(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Reserva aprobada exitosamente');
            this.loadReserves();
          }
        },
        error: (error) => {
          console.error('Error al aprobar reserva:', error);
          alert('Error al aprobar la reserva');
        },
      });
    }
  }

  rejectReserve(id: number): void {
    if (confirm('¿Está seguro de rechazar esta reserva?')) {
      this.reserveService.rejectReserve(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Reserva rechazada exitosamente');
            this.loadReserves();
          }
        },
        error: (error) => {
          console.error('Error al rechazar reserva:', error);
          alert('Error al rechazar la reserva');
        },
      });
    }
  }

  viewDetails(reserve: Reserve): void {
    this.selectedReserve = reserve;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReserve = null;
  }

  onModalClose(visible: boolean): void {
    if (!visible) {
      this.selectedReserve = null;
    }
  }

  changePage(page: number): void {
    if (
      page >= 1 &&
      page * this.pageSize <= this.totalRecords + this.pageSize
    ) {
      this.currentPage = page;
      this.loadReserves();
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pendingpay: 'Pendiente de Pago',
      done: 'Completado',
      rejected: 'Rechazado',
    };
    return labels[status] || status;
  }
}
