import { Component } from '@angular/core';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  TableColorDirective,
  TableDirective,
} from '@coreui/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Pagination,
  PaginationParams,
} from '../../../data/interfaces/pagination.interface';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminResponse } from '../../../data/interfaces/admin.interface';
import { AdminService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Roles } from '../../../core/enum/roles.enum';
import { ProfileService } from '../../../core/services/profile.service';
import { LoadingComponent } from '../../../shared/loading/loading.component';

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
    FormsModule,
    LoadingComponent,
  ],
  providers: [AdminService, ProfileService, HttpClient],
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
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public profileService: ProfileService
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
    this.loadUsers(this.state);
  }

  loadUsers(state: number): void {
    this.loading = true;
    this.state = state;
    let body: PaginationParams = {
      page: this.page,
      state: state,
    };
    const pageSize = 12;

    this.adminService.getAdmin(body, state).subscribe({
      next: (data) => {
        let adminData: Pagination = data as unknown as Pagination;
        this.dataAdmin = adminData.rows;
        this.pageTotal = Math.ceil(
          (adminData.count || this.dataAdmin.length) / pageSize
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
        this.loading = false;
      },
    });
  }

  searchUser(): void {
    if (this.searchTerm.trim() === '') {
      this.loadUsers(this.state);
      return;
    }
    this.loading = true;
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.adminService.searchAdmin(body, this.searchTerm).subscribe({
      next: (data) => {
        let adminData: Pagination = data as unknown as Pagination;
        this.dataAdmin = adminData.rows;
        this.pageTotal = Math.ceil(
          (adminData.count || this.dataAdmin.length) / pageSize
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
        this.loading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadUsers(this.state);
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadUsers(this.state);
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
    this.loading = true;
    const formData = this.adminForm.value;
    this.adminService.createAdmin(formData).subscribe({
      next: (data) => {
        this.toastr.success('Se creo el administrador con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadUsers(this.state);
        this.AddModalClose();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al crear el administrador', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loading = false;
      },
    });
  }

  updateAdmin() {
    if (this.editForm.invalid || this.selectedUserId === null) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.loading = true;
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
        this.loadUsers(this.state);
        this.closeEditModal();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el administrador', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loading = false;
      },
    });
  }

  blockAdmin(userId: number, state: boolean) {
    this.loading = true;
    this.adminService.blockAdmin(userId, { state: state }).subscribe({
      next: () => {
        this.toastr.success(
          `Se ${state ? 'desactivó' : 'activó'} el administrador con exito`,
          'Realizado',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadUsers(this.state);
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(
          'Error al cambiar el estado del administrador',
          'Error',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loading = false;
      },
    });
  }

  getRoles() {
    const userRole = this.profileService.getStoredProfile();
    switch (userRole?.admin_role?.rol) {
      case Roles.SUPER_ADMIN:
        return [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.SUPPORT];
      case Roles.ADMIN:
        return [Roles.SUPPORT];
      case Roles.SUPPORT:
        return [];
      default:
        return [];
    }
  }

  getRoleId(role: string): number {
    switch (role) {
      case Roles.SUPER_ADMIN:
        return 1;
      case Roles.ADMIN:
        return 2;
      case Roles.SUPPORT:
        return 3;
      default:
        return 0;
    }
  }
}
