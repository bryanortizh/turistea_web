import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  TableColorDirective,
  TableDirective,
} from '@coreui/angular';
import { AdminResponse } from '../../../data/interfaces/admin.interface';
import { ToastrService } from 'ngx-toastr';
import {
  Pagination,
  PaginationParams,
} from '../../../data/interfaces/pagination.interface';
import { ClientService } from '../../../core/services/client.service';
@Component({
  selector: 'app-user-client',
  imports: [
    CommonModule,
    TableDirective,
    TableColorDirective,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonDirective,
  ],
  providers: [ClientService, HttpClient],
  templateUrl: './user-client.component.html',
  styleUrl: './user-client.component.scss',
  standalone: true,
})
export class UserClientComponent {
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataAdmin: AdminResponse[] = [];
  adminForm: FormGroup;
  editForm: FormGroup;
  selectedUserId: number | null = null;
  visible = false;
  visibleEdit = false;
  timeOutmessage = 5000;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.adminForm = this.fb.group({
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

    this.editForm = this.fb.group({
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

    this.clientService.getClient(body).subscribe({
      next: (data) => {
        let adminData: Pagination = data as unknown as Pagination;
        this.dataAdmin = adminData.rows;
        this.pageTotal = Math.ceil(
          (adminData.count || this.dataAdmin.length) / pageSize
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

  blockUser(id: number): void {
    this.clientService.updateAdmin(id).subscribe({
      next: (data) => {
        this.toastr.success('Usuario bloqueado con éxito', 'Éxito', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadUsers();
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el usuario', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }
}
