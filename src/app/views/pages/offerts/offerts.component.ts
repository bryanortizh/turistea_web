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
  ModalFooterComponent,
  ModalHeaderComponent,
  TableColorDirective,
  TableDirective,
} from '@coreui/angular';
import { ToastrService } from 'ngx-toastr';
import { PackageService } from '../../../core/services/package.service';
import { PackageResponse } from '../../../data/interfaces/package.interface';
import {
  Pagination,
  PaginationParams,
} from '../../../data/interfaces/pagination.interface';
import { DriverService } from '../../../core/services/driver.service';
import { DriverResponse } from '../../../data/interfaces/driver.interface';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerts',
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
    NgSelectComponent,
  ],
  providers: [PackageService, DriverService, HttpClient],
  templateUrl: './offerts.component.html',
  styleUrl: './offerts.component.scss',
  standalone: true,
})
export class OffertsComponent {
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataPackage: PackageResponse[] = [];
  packageForm: FormGroup;
  editPackageForm: FormGroup;
  visiblePackageModal = false;
  selectedPackage: PackageResponse | null = null;
  visibleAddPackageModal = false;
  visibleEditPackageModal = false;
  timeOutmessage = 5000;
  selectedImagePreview: string | null = null;
  dataDriver: DriverResponse[] = [];
  selectedCar!: number;
  loadingDrivers = false;
  driverInput$ = new Subject<string>();
  bindLabel = 'name + " " + lastname';

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  constructor(
    private packageService: PackageService,
    private driverService: DriverService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.packageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_region: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      image_bg: ['', [Validators.required]],
    });

    this.editPackageForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_region: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      image_bg: [''], // No requerido en edición
    });

    this.loadDrivers();
  }
  ngOnInit(): void {
    this.loadPackages();
  }

  loadDrivers() {
    this.driverInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.length < 2) {
            return of([]);
          }
          this.loadingDrivers = true;
          return this.driverService.searchDriver(term).pipe(
            catchError(() => {
              this.toastr.error('Error al buscar conductores', 'Error', {
                timeOut: this.timeOutmessage,
                closeButton: true,
                progressBar: true,
              });
              return of([]);
            })
          );
        })
      )
      .subscribe((drivers) => {
        this.dataDriver = drivers;
        this.loadingDrivers = false;
      });
  }

  allDrivers() {
    this.loadingDrivers = true;
    this.driverService.allDrivers().subscribe({
      next: (data) => {
        this.dataDriver = data;
        this.loadingDrivers = false;
      }
    });
  }

  loadPackages(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.packageService.getClient(body).subscribe({
      next: (data) => {
        let packageData: Pagination = data as unknown as Pagination;
        this.dataPackage = packageData.rows;
        this.pageTotal = Math.ceil(
          (packageData.count || this.dataPackage.length) / pageSize
        );
      },
      error: (error) => {},
    });
  }

  showClientsBlock(): void {
    this.state = this.state === 1 ? 0 : 1;
    this.page = 1;
    this.loadPackages();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadPackages();
  }

  openPackageModal(index: number) {
    this.selectedPackage = this.dataPackage[index];
    this.visiblePackageModal = true;
  }

  closePackageModal() {
    this.visiblePackageModal = false;
    this.selectedPackage = null;
  }

  blockUser(user: PackageResponse): void {
    const state =
      this.dataPackage.find((u) => u.id === user.id)?.state === true
        ? false
        : true;

    this.packageService.blockPackage(user, state).subscribe({
      next: (data) => {
        this.toastr.success(
          `Paquetes ${state ? 'desbloqueado' : 'bloqueado'} con éxito`,
          'Éxito',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadPackages();
      },
      error: (error) => {
        this.toastr.error('Error al bloquear el paquete', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  savePackage() {
    this.visibleAddPackageModal = true;
  }

  closeAddPackageModal() {
    this.visibleAddPackageModal = false;
    this.packageForm.reset();
  }

  // Métodos para modal de edición
  openEditPackageModal(index: number) {
    this.allDrivers();
    this.selectedPackage = this.dataPackage[index];
    if (this.selectedPackage) {
      // Llenar el formulario con los datos del paquete seleccionado
      this.editPackageForm.patchValue({
        id: this.selectedPackage.id,
        title: this.selectedPackage.title,
        description: this.selectedPackage.description,
        name_region: this.selectedPackage.name_region,
        id_driver: this.selectedPackage.id_driver,
        image_bg: '', // No cargar la imagen existente
      });

      console.log(this.selectedPackage.id_driver);
      // Buscar y seleccionar el conductor actual
      if (this.selectedPackage.id_driver) {
        this.loadDriverForEdit(this.selectedPackage.id_driver);
      }

      this.visibleEditPackageModal = true;
    }
  }

  closeEditPackageModal() {
    this.visibleEditPackageModal = false;
    this.editPackageForm.reset();
    this.selectedPackage = null;
    this.selectedImagePreview = null; // Limpiar preview de imagen
  }

  loadDriverForEdit(driverId: number) {
    // Buscar el conductor en la lista actual o hacer una búsqueda específica
    const existingDriver = this.dataDriver.find(
      (driver) => driver.id === driverId
    );
    if (!existingDriver) {
      // Si no está en la lista actual, podrías hacer una búsqueda específica
      // Por ahora, simplemente establecemos el valor
      this.editPackageForm.patchValue({ id_driver: driverId });
    }
  }

  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String;

        this.packageForm.patchValue({
          [fieldName]: base64,
        });
        this.packageForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelectEdit(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String;

        this.editPackageForm.patchValue({
          [fieldName]: base64,
        });
        this.editPackageForm.get(fieldName)?.updateValueAndValidity();

        // Guardar preview de la nueva imagen
        this.selectedImagePreview = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitPackage() {
    if (this.packageForm.valid) {
      const formData = new FormData();
      Object.keys(this.packageForm.value).forEach((key) => {
        formData.append(key, this.packageForm.value[key]);
      });

      this.closeAddPackageModal();
    } else {
      this.packageForm.markAllAsTouched();
    }
  }

  createPackage() {
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      return;
    }
    const formData = this.packageForm.value;
    this.packageService.createPackage(formData).subscribe({
      next: (data) => {
        this.toastr.success('Se creo el paquete con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadPackages();
        this.closeAddPackageModal();
      },
      error: (error) => {
        this.toastr.error('Error al crear el paquete', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  updatePackage() {
    if (this.editPackageForm.invalid) {
      this.editPackageForm.markAllAsTouched();
      return;
    }

    const formData = this.editPackageForm.value;
    const packageId = formData.id;

    if (!formData.image_bg) {
      delete formData.image_bg;
    }

    this.packageService.updatePackage(packageId, formData).subscribe({
      next: (data) => {
        this.toastr.success('Paquete actualizado con éxito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadPackages();
        this.closeEditPackageModal();
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el paquete', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  onDriverSelected(driverId: any) {
    console.log('Conductor seleccionado:', driverId);
  }

  onDriverSelectedEdit(driverId: any) {
    this.editPackageForm.patchValue({ id_driver: driverId.id });
  }

  openRouterPackage(id: number) {
    this.router.navigate(['/offers/package', id]);
  }
}
