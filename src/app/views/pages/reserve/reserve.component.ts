import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReserveService } from '../../../core/services/reserve.service';
import { Reserve } from '../../../models/reserve.model';
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
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
export class ReserveComponent implements OnInit, OnDestroy {
  reserves: any[] = [];
  selectedReserve: any | null = null;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  loading: boolean = false;
  showModal: boolean = false;
  statusFilter: string = 'pendingpayinprocess';
  private socket: Socket;
  private timeOutmessage: number = 5000;
  private notificationSound: HTMLAudioElement;
  audioInitialized: boolean = false; // Cambiar a public para usarlo en el template

  constructor(
    private reserveService: ReserveService,
    private toastr: ToastrService
  ) {
    // Inicializar socket connection
    this.socket = io(environment.socketUrl || 'http://localhost:4001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Inicializar audio
    this.notificationSound = new Audio();
    this.notificationSound.src = 'assets/music/notification.mp3';
    this.notificationSound.volume = 0.5; // Volumen al 50%
    this.notificationSound.load();
  }

  ngOnInit(): void {
    this.loadReserves(this.statusFilter);
    this.setupSocketListeners();
    setTimeout(() => {
      this.enableNotificationSound();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpiar listeners y desconectar socket
    this.socket.off('form_reserve_status_changed');
    this.socket.off('new_form_reserve');
    this.socket.disconnect();
  }

  private setupSocketListeners(): void {
    // Escuchar cuando el socket se conecta
    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
    });

    // Escuchar errores de conexión
    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión socket:', error);
    });

    // Escuchar cambios de estado en las reservas
    this.socket.on('form_reserve_status_changed', (data: any) => {
      console.log('Estado de reserva cambió:', data);

      if (data && data.formReserveId) {
        // Reproducir sonido de notificación
        this.playNotificationSound();

        // Mostrar notificación toast
        const statusLabel = this.getStatusLabel(data.newStatus || data.status_form);
        this.toastr.info(
          `La reserva #${data.formReserveId} cambió a: ${statusLabel}`,
          'Estado de Reserva Actualizado',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );

        // Actualizar la lista de reservas
        this.loadReserves(this.statusFilter);
      }
    });

    // Escuchar nuevas reservas
    this.socket.on('new_form_reserve', (data: any) => {
      console.log('Nueva reserva creada:', data);

      if (data) {
        this.playNotificationSound();

        // Mostrar notificación toast
        this.toastr.success(
          `Nueva reserva registrada de ${data.full_name || 'un cliente'} para el paquete ${data.package?.title || ''}`,
          'Nueva Reserva Recibida',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );

        if (data.status_form === this.statusFilter || this.statusFilter === 'all') {
          this.loadReserves(this.statusFilter);
        }
      }
    });

    this.socket.on('form_reserve_deleted', (data: any) => {
      console.log('Reserva eliminada:', data);

      if (data && data.id) {
        this.toastr.warning(
          `La reserva #${data.id} ha sido eliminada`,
          'Reserva Eliminada',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );

        this.loadReserves(this.statusFilter);
      }
    });
  }

  enableNotificationSound(): void {
    this.notificationSound.play()
      .then(() => {
        this.notificationSound.pause();
        this.notificationSound.currentTime = 0;
        this.audioInitialized = true;
        this.toastr.success(
          'Las notificaciones de audio están habilitadas',
          'Audio Habilitado',
          {
            timeOut: 3000,
            closeButton: true,
            progressBar: true,
          }
        );
      })
      .catch(error => {
        console.error('Error al habilitar audio:', error);
        this.toastr.error(
          'No se pudo habilitar el audio. Verifique los permisos del navegador.',
          'Error de Audio',
          {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
          }
        );
      });
  }

  private playNotificationSound(): void {
    if (!this.audioInitialized) {
      console.warn('Audio no inicializado. Se requiere interacción del usuario.');
      this.toastr.warning(
        'Haga clic en el botón "Habilitar Sonido" para recibir notificaciones de audio',
        'Audio Deshabilitado',
        {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        }
      );
      return;
    }

    try {
      // Crear una promesa para manejar el play
      const playPromise = this.notificationSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio reproducido exitosamente
            console.log('Sonido de notificación reproducido');
            // Resetear al final para poder reproducir de nuevo
            this.notificationSound.onended = () => {
              this.notificationSound.currentTime = 0;
            };
          })
          .catch(error => {
            console.warn('No se pudo reproducir el sonido de notificación:', error);
            // Intentar usar Web Audio API como alternativa
            this.playBeepSound();
          });
      }
    } catch (error) {
      console.warn('Error al reproducir sonido:', error);
      this.playBeepSound();
    }
  }

  private playBeepSound(): void {
    // Alternativa usando Web Audio API para crear un beep simple
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Frecuencia en Hz
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('No se pudo crear beep alternativo:', error);
    }
  }

  loadReserves(status: string): void {
    this.loading = true;
    this.reserveService
      .getReserves(this.currentPage, this.pageSize, status)
      .subscribe({
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
            this.loadReserves(this.statusFilter);
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
            this.loadReserves(this.statusFilter);
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
      this.loadReserves(this.statusFilter);
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pendingpayinprocess: 'Revisión de Pago',
      reserve: 'Reservado',
      rejected: 'Rechazado',
    };
    return labels[status] || status;
  }

  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadReserves(this.statusFilter);
  }
}
