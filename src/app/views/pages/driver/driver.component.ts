import { Component } from '@angular/core';
import { DriverResponse } from '../../../data/interfaces/driver.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DriverService } from '../../../core/services/driver.service';
import { ToastrService } from 'ngx-toastr';
import {
  Pagination,
  PaginationParams,
} from '../../../data/interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  TableColorDirective,
  TableDirective,
} from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-driver',
  imports: [
    CommonModule,
    TableDirective,
    TableColorDirective,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  providers: [DriverService, HttpClient],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss',
  standalone: true,
})
export class DriverComponent {
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataDriver: DriverResponse[] = [];
  driverForm: FormGroup;
  editDriver: FormGroup;
  visibleDriverModal = false;
  selectedDriver: any = null;

  timeOutmessage = 5000;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.driverForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      admin_rol_id: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    this.editDriver = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      admin_rol_id: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.driverService.getClient(body).subscribe({
      next: (data) => {
        let driverData: Pagination = data as unknown as Pagination;
        this.dataDriver = driverData.rows;
        this.pageTotal = Math.ceil(
          (driverData.count || this.dataDriver.length) / pageSize
        );
      },
      error: (error) => {},
    });
  }

  showClientsBlock(): void {
    this.state = this.state === 1 ? 0 : 1;
    this.page = 1;
    this.loadUsers();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadUsers();
  }

  openDriverModal(index: number) {
    this.selectedDriver = this.dataDriver[index];
    this.visibleDriverModal = true;
  }

  closeDriverModal() {
    this.visibleDriverModal = false;
    this.selectedDriver = null;
  }
  blockUser(id: number): void {
    const state = this.dataDriver.find(user => user.id === id)?.state === true ? false : true;
    this.driverService.blockDriver(id, state).subscribe({
      next: (data) => {
        this.toastr.success(`Conductor ${state ? 'desbloqueado' : 'bloqueado'} con éxito`, 'Éxito', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadUsers();
      },
      error: (error) => {
        this.toastr.error('Error al bloquear el conductor', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }
}
