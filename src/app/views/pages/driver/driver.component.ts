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
  visibleAddDriverModal = false;
  timeOutmessage = 5000;

  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.driverForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.minLength(8)]],
      number_plate: ['', [Validators.required, Validators.minLength(6)]],
      brand_car: ['', [Validators.required]],
      model_car: ['', [Validators.required]],
      name_district: ['', [Validators.required]],
      name_province: ['', [Validators.required]],
      name_region: ['', [Validators.required]],
      image_car: ['', [Validators.required]],
      image_document: ['', [Validators.required]],
    });

    this.editDriver = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
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
    this.loadDrivers();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadDrivers();
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
    const state =
      this.dataDriver.find((user) => user.id === id)?.state === true
        ? false
        : true;
    this.driverService.blockDriver(id, state).subscribe({
      next: (data) => {
        this.toastr.success(
          `Conductor ${state ? 'desbloqueado' : 'bloqueado'} con éxito`,
          'Éxito',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadDrivers();
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

  saveDriver() {
    this.visibleAddDriverModal = true;
  }

  closeAddDriverModal() {
    this.visibleAddDriverModal = false;
    this.driverForm.reset();
  }

 onFileSelect(event: any, fieldName: string) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      const base64 = base64String;
      
      this.driverForm.patchValue({
        [fieldName]: base64,
      });
      this.driverForm.get(fieldName)?.updateValueAndValidity();
    };
    reader.readAsDataURL(file);
  }
}

  onSubmitDriver() {
    if (this.driverForm.valid) {
      const formData = new FormData();
      Object.keys(this.driverForm.value).forEach((key) => {
        formData.append(key, this.driverForm.value[key]);
      });

      this.closeAddDriverModal();
    } else {
      this.driverForm.markAllAsTouched();
    }
  }

  createDriver() {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }
    const formData = this.driverForm.value;
    this.driverService.createDriver(formData).subscribe({
      next: (data) => {
        this.toastr.success('Se creo el conductor con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadDrivers();
        this.closeAddDriverModal();
      },
      error: (error) => {
        this.toastr.error('Error al crear el conductor', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }
}
