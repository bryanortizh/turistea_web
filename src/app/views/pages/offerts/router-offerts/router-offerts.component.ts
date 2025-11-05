import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../../../../core/services/driver.service';
import { PackageResponse } from '../../../../data/interfaces/package.interface';
import { DriverResponse } from '../../../../data/interfaces/driver.interface';
import {
  Pagination,
  PaginationParams,
} from '../../../../data/interfaces/pagination.interface';
import { RouterTrackingRouterService } from '../../../../core/services/package-router.service';

@Component({
  selector: 'app-router-offerts',
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
  providers: [RouterTrackingRouterService, DriverService, HttpClient],
  templateUrl: './router-offerts.component.html',
  styleUrl: './router-offerts.component.scss',
})
export class RouterOffertsComponent implements OnInit {
  id: string | null = null;
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataPackage: PackageResponse[] = [];
  packageForm: FormGroup;
  visiblePackageModal = false;
  selectedPackage: PackageResponse | null = null;
  visibleAddPackageModal = false;
  timeOutmessage = 5000;
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
    private routerTrackingRouterService: RouterTrackingRouterService,
    private driverService: DriverService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.packageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_district: ['', [Validators.required]],
      name_province: ['', [Validators.required]],
      name_region: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      image_bg: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadPackages();
  }

  loadPackages(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.routerTrackingRouterService.getRouter(this.id,body).subscribe({
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

    this.routerTrackingRouterService.blockRouterTracking(user, state).subscribe({
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
    this.routerTrackingRouterService.createRouterTracking(formData).subscribe({
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

}
