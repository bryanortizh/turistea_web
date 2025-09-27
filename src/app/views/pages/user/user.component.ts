import { Component } from '@angular/core';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  TableColorDirective,
  TableDirective,
} from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Pagination,
  PaginationParams,
} from '../../../data/interfaces/pagination.interface';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminResponse } from '../../../data/interfaces/admin.interface';
import { AdminService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    TableDirective,
    TableColorDirective,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonDirective,
    ModalTitleDirective,
    ModalComponent,
    ModalHeaderComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
  ],
  providers: [AdminService, HttpClient],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  standalone: true,
})
export class UserComponent {
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
    private adminService: AdminService,
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

    this.adminService.getAdmin(body).subscribe({
      next: (data) => {
        let adminData: Pagination = data as unknown as Pagination;
        this.dataAdmin = adminData.rows;
        this.pageTotal = Math.ceil(
          (adminData.count || this.dataAdmin.length) / pageSize
        );
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadUsers();
  }

  AddModal() {
    this.visible = !this.visible;
  }

  AddModalClose() {
    this.adminForm.reset();
    this.visible = false;
  }

  openEditModal(user: any) {
    this.selectedUserId = user.id;
    this.editForm.patchValue({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      cellphone: user.cellphone,
      admin_rol_id: user.admin_role.id,
    });
    this.visibleEdit = true;
  }

  closeEditModal() {
    this.visibleEdit = false;
    this.editForm.reset();
  }

  createAdmin() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    const formData = this.adminForm.value;
    this.adminService.createAdmin(formData).subscribe({
      next: (data) => {
          this.toastr.success(
              'Se creo el administrador con exito',
              'Realizado',
              {
                timeOut: this.timeOutmessage,
                closeButton: true,
                progressBar: true,
              }
            );
        this.loadUsers();
        this.AddModalClose();
      },
      error: (error) => {
        this.toastr.error(
          'Error al crear el administrador',
          'Error',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
      },
    });
  }

  updateAdmin() {
    if (this.editForm.invalid || this.selectedUserId === null) {
      this.editForm.markAllAsTouched();
      return;
    }
    const formData = this.editForm.value;
    this.adminService.updateAdmin(this.selectedUserId, formData).subscribe({
      next: (data) => {
        this.toastr.success(
          'Se actualizo el administrador con exito',
          'Realizado',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadUsers();
        this.closeEditModal();
      },
      error: (error) => {
        this.toastr.error(
          'Error al actualizar el administrador',
          'Error',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
      },
    });
  }
}
