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
import { GuideServices } from '../../../core/services/guide.service';
import { GuideResponse } from '../../../data/interfaces/guide.interface';
import { TerraceServices } from '../../../core/services/terrace.service';
import { TerraceResponse } from '../../../data/interfaces/terrace.interface';
import { SearchSelectComponent } from '../../../components/search-select/search-select.component';
import { Observable, Subject } from 'rxjs';
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
    SearchSelectComponent,
  ],
  providers: [PackageService, DriverService, GuideServices, TerraceServices, HttpClient],
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

  constructor(
    private packageService: PackageService,
    private driverService: DriverService,
    private guideService: GuideServices,
    private terraceService: TerraceServices,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.packageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_region: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      id_guide: ['', [Validators.required]],
      id_terrace: ['', [Validators.required]],
      image_bg: ['', [Validators.required]],
      image_bg_two: ['', [Validators.required]],
      quantity_person: ['', [Validators.required, Validators.min(1)]],
    });

    this.editPackageForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_region: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      id_guide: ['', [Validators.required]],
      id_terrace: ['', [Validators.required]],
      image_bg: [''],
      image_bg_two: [''],
      quantity_person: ['', [Validators.required, Validators.min(1)]],
    });
  }
  
  ngOnInit(): void {
    this.loadPackages();
  }

  // Funciones de búsqueda para el SearchSelectComponent
  searchDrivers = (term: string): Observable<DriverResponse[]> => {
    return this.driverService.searchDriver(term);
  }

  searchGuides = (term: string): Observable<GuideResponse[]> => {
    return this.guideService.searchGuide(term);
  }

  searchTerraces = (term: string): Observable<TerraceResponse[]> => {
    return this.terraceService.searchTerrace(term);
  }

  // Funciones para obtener todos los items (para filtrar en edición)
  getAllDrivers = (): Observable<DriverResponse[]> => {
    return this.driverService.allDrivers();
  }

  getAllGuides = (): Observable<GuideResponse[]> => {
    return this.guideService.allGuides();
  }

  getAllTerraces = (): Observable<TerraceResponse[]> => {
    return this.terraceService.allTerraces();
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
    this.packageForm.reset();
    this.visibleAddPackageModal = true;
  }

  closeAddPackageModal() {
    this.visibleAddPackageModal = false;
    this.packageForm.reset();
  }

  openEditPackageModal(index: number) {
    this.selectedPackage = this.dataPackage[index];
    if (this.selectedPackage) {
      this.editPackageForm.patchValue({
        id: this.selectedPackage.id,
        title: this.selectedPackage.title,
        description: this.selectedPackage.description,
        name_region: this.selectedPackage.name_region,
        id_driver: this.selectedPackage.id_driver,
        id_guide: this.selectedPackage.id_guide,
        id_terrace: this.selectedPackage.id_terrace,
        quantity_person: this.selectedPackage.quantity_person,
        image_bg: this.selectedPackage.path_bg,
        image_bg_two: this.selectedPackage.path_bg_two,
      });

      this.visibleEditPackageModal = true;
    }
  }

  closeEditPackageModal() {
    this.visibleEditPackageModal = false;
    this.editPackageForm.reset();
    this.selectedPackage = null;
    this.selectedImagePreview = null;
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

  openRouterPackage(id: number) {
    this.router.navigate(['/offers/package', id]);
  }
}
