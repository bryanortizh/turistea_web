import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
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
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '../../../../core/services/driver.service';
import { DriverResponse } from '../../../../data/interfaces/driver.interface';
import {
  RouterTrackingResponse,
  RouteItem,
} from '../../../../data/interfaces/router-tracking.interface';
import {
  Pagination,
  PaginationParams,
} from '../../../../data/interfaces/pagination.interface';
import { RouterTrackingRouterService } from '../../../../core/services/package-router.service';
import { LoadingComponent } from '../../../../shared/loading/loading.component';

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
    LoadingComponent
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
  dataPackage: RouterTrackingResponse[] = [];
  packageForm: FormGroup;
  visiblePackageModal = false;
  selectedPackage: RouterTrackingResponse | null = null;
  selectedPackageRoutes: RouteItem[] = [];
  visibleAddPackageModal = false;
  isEditMode = false;
  editingPackageId: number | null = null;
  timeOutmessage = 5000;
  dataDriver: DriverResponse[] = [];
  selectedCar!: number;
  loadingDrivers = false;
  driverInput$ = new Subject<string>();
  bindLabel = 'name + " " + lastname';
  loading = false;

  constructor(
    private routerTrackingRouterService: RouterTrackingRouterService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.packageForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      name_district: ['', [Validators.required]],
      name_province: ['', [Validators.required]],
      id_package: [this.id, [Validators.required]],
      route_json: this.fb.array([]),
      image_one: [''],
      image_two: [''],
      image_tree: [''],
      price_route: ['', [Validators.required, Validators.min(1)]],
      address_initial: ['', [Validators.required]],
      address_final: ['', [Validators.required]],
    });

    this.addRoute();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.packageForm.patchValue({ id_package: this.id });
    this.loadPackages();
  }

  get routeFormArray(): FormArray {
    return this.packageForm.get('route_json') as FormArray;
  }

  createRouteFormGroup(): FormGroup {
    return this.fb.group({
      id: [this.routeFormArray.length + 1],
      index: [this.routeFormArray.length],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      bg_image: [''],
    });
  }

  addRoute(): void {
    this.routeFormArray.push(this.createRouteFormGroup());
  }

  removeRoute(index: number): void {
    if (this.routeFormArray.length > 1) {
      this.routeFormArray.removeAt(index);
      this.updateRouteIdsAndIndexes();
    }
  }

  updateRouteIdsAndIndexes(): void {
    this.routeFormArray.controls.forEach((control, index) => {
      control.patchValue({
        id: index + 1,
        index: index,
      });
    });
  }

  loadPackages(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.loading = true;
    this.routerTrackingRouterService.getRouter(this.id, body).subscribe({
      next: (data) => {
        this.loading = false;
        let packageData: Pagination = data as unknown as Pagination;
        this.dataPackage = packageData.rows;
        this.pageTotal = Math.ceil(
          (packageData.count || this.dataPackage.length) / pageSize
        );
      },
      error: (error) => {
        this.loading = false;
      },
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

    if (this.selectedPackage?.route_json) {
      try {
        this.selectedPackageRoutes = JSON.parse(
          this.selectedPackage.route_json
        ) as RouteItem[];
      } catch (error) {
        this.selectedPackageRoutes = [];
      }
    } else {
      this.selectedPackageRoutes = [];
    }

    this.visiblePackageModal = true;
  }

  closePackageModal() {
    this.visiblePackageModal = false;
    this.selectedPackage = null;
    this.selectedPackageRoutes = [];
  }

  blockUser(user: RouterTrackingResponse): void {
    const state =
      this.dataPackage.find((u) => u.id === user.id)?.state === true
        ? false
        : true;
    this.loading = true;
    this.routerTrackingRouterService
      .blockRouterTracking(user, state)
      .subscribe({
        next: (data) => {
          this.loading = false;
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
          this.loading = false;
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
    this.isEditMode = false;
  }

  editPackage(packageData: RouterTrackingResponse) {
    this.isEditMode = true;
    this.editingPackageId = packageData.id;
    this.visibleAddPackageModal = true;

    this.packageForm.patchValue({
      title: packageData.title,
      description: packageData.description,
      name_district: packageData.name_district,
      name_province: packageData.name_province,
      price_route: packageData.price_route,
      address_initial: packageData.address_initial,
      address_final: packageData.address_final,
      id_package: this.id,
    });

    while (this.routeFormArray.length !== 0) {
      this.routeFormArray.removeAt(0);
    }

    if (packageData.route_json) {
      try {
        const routes = JSON.parse(packageData.route_json) as any[];
        routes.forEach((route, index) => {
          const routeGroup = this.createRouteFormGroup();
          routeGroup.patchValue({
            id: route.id || null,
            index: index,
            title: route.title || '',
            description: route.description || '',
            bg_image: route.bg_image || '',
            bg_image_key: route.bg_image_key || '',
            bg_image_size: route.bg_image_size || '',
            price_route: route.price_route || '',
            address_initial: route.address_initial || '',
            address_final: route.address_final || '',
          });
          this.routeFormArray.push(routeGroup);
        });
      } catch (error) {
        this.addRoute();
      }
    } else {
      this.addRoute();
    }
  }

  closeAddPackageModal() {
    this.visibleAddPackageModal = false;
    this.isEditMode = false;
    this.editingPackageId = null;
    this.packageForm.reset();

    while (this.routeFormArray.length !== 0) {
      this.routeFormArray.removeAt(0);
    }

    this.addRoute();

    this.packageForm.patchValue({ id_package: this.id });
  }

  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;

        this.packageForm.patchValue({
          [fieldName]: base64String,
        });
        this.packageForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onRouteImageSelect(event: any, routeIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const routeControl = this.routeFormArray.at(routeIndex);
        routeControl.patchValue({ bg_image: base64String });
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
    console.log(this.packageForm);
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      return;
    }

    const formData = { ...this.packageForm.value };

    formData.route_json = JSON.stringify(formData.route_json);
    this.loading = true;
    this.routerTrackingRouterService.createRouterTracking(formData).subscribe({
      next: (data) => {
        this.loading = false;
        this.toastr.success('Se creó la configuración con éxito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadPackages();
        this.closeAddPackageModal();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error al crear la configuración', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  updatePackage() {
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData = { ...this.packageForm.value };

    const processedRoutes = formData.route_json.map((route: any) => {
      const processedRoute = { ...route };

      if (
        processedRoute.bg_image &&
        processedRoute.bg_image.startsWith('data:image/')
      ) {
        delete processedRoute.bg_image_key;
        delete processedRoute.bg_image_size;
      }

      return processedRoute;
    });
    formData.route_json = JSON.stringify(processedRoutes);

    const updateId = this.editingPackageId!;

    this.routerTrackingRouterService
      .updateRouterTracking(updateId, formData)
      .subscribe({
        next: (data) => {
          this.loading = false;

          this.toastr.success(
            'Se actualizó la configuración con éxito',
            'Realizado',
            {
              timeOut: this.timeOutmessage,
              closeButton: true,
              progressBar: true,
            }
          );
          this.loadPackages();
          this.closeAddPackageModal();
        },
        error: (error) => {
          this.loading = false;

          this.toastr.error('Error al actualizar la configuración', 'Error', {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          });
        },
      });
  }
}
