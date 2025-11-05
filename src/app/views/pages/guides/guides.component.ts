import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { GuideServices } from '../../../core/services/guide.service';
import { GuideResponse } from '../../../data/interfaces/guide.interface';

@Component({
  selector: 'app-guide',
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
  providers: [GuideServices, HttpClient],
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.scss',
  standalone: true,
})
export class GuideComponent {
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataGuide: GuideResponse[] = [];
  guideForm: FormGroup;
  editGuideForm: FormGroup;
  visibleGuideModal = false;
  selectedGuide: any = null;
  visibleAddGuideModal = false;
  visibleEditGuideModal = false;
  selectedGuideId: number = 0;
  timeOutmessage = 5000;

  constructor(
    private guideService: GuideServices,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.guideForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.minLength(8)]],
      sexo: ['', [Validators.required]],
      image_photo: ['', [Validators.required]],
    });

    this.editGuideForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.minLength(8)]],
      sexo: ['', [Validators.required]],
      image_photo: [''],
    });
  }

  ngOnInit(): void {
    this.loadGuides();
  }

  loadGuides(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;

    this.guideService.getGuide(body).subscribe({
      next: (data) => {
        let driverData: Pagination = data as unknown as Pagination;
        this.dataGuide = driverData.rows;
        this.pageTotal = Math.ceil(
          (driverData.count || this.dataGuide.length) / pageSize
        );
      },
      error: (error) => {},
    });
  }

  showClientsBlock(): void {
    this.state = this.state === 1 ? 0 : 1;
    this.page = 1;
    this.loadGuides();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadGuides();
  }

  openGuideModal(index: number) {
    this.selectedGuide = this.dataGuide[index];
    this.visibleGuideModal = true;
  }

  closeGuideModal() {
    this.visibleGuideModal = false;
    this.selectedGuide = null;
  }

  blockUser(user: GuideResponse): void {
    const state =
      this.dataGuide.find((u) => u.id === user.id)?.state === true
        ? false
        : true;

    this.guideService.blockGuide(user, state).subscribe({
      next: (data) => {
        this.toastr.success(
          `Guía ${state ? 'desbloqueada' : 'bloqueada'} con éxito`,
          'Éxito',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadGuides();
      },
      error: (error) => {
        this.toastr.error('Error al bloquear el guía', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  saveGuide() {
    this.visibleAddGuideModal = true;
  }

  closeAddGuideModal() {
    this.visibleAddGuideModal = false;
    this.guideForm.reset();
  }

  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String;

        this.guideForm.patchValue({
          [fieldName]: base64,
        });
        this.guideForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitGuide() {
    if (this.guideForm.valid) {
      const formData = new FormData();
      Object.keys(this.guideForm.value).forEach((key) => {
        formData.append(key, this.guideForm.value[key]);
      });

      this.closeAddGuideModal();
    } else {
      this.guideForm.markAllAsTouched();
    }
  }

  createGuide() {
    if (this.guideForm.invalid) {
      this.guideForm.markAllAsTouched();
      return;
    }
    const formData = this.guideForm.value;
    this.guideService.createGuide(formData).subscribe({
      next: (data) => {
        this.toastr.success('Se creo el guía con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadGuides();
        this.closeAddGuideModal();
      },
      error: (error) => {
        this.toastr.error('Error al crear el guía', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  openEditGuideModal(index: number) {
    const driver = this.dataGuide[index];
    this.selectedGuideId = driver.id;

    this.editGuideForm.patchValue({
      name: driver.name,
      lastname: driver.lastname,
      email: driver.email,
      cellphone: driver.cellphone,
      type_document: driver.type_document,
      number_document: driver.number_document,
      sexo: driver.sexo,
    });

    this.visibleEditGuideModal = true;
  }

  closeEditGuideModal() {
    this.visibleEditGuideModal = false;
    this.editGuideForm.reset();
    this.selectedGuideId = 0;
  }

  onFileSelectEdit(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String.split(',')[1];

        this.editGuideForm.patchValue({
          [fieldName]: base64,
        });
        this.editGuideForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  updateGuide() {
    if (this.editGuideForm.invalid) {
      this.editGuideForm.markAllAsTouched();
      return;
    }
    const formData = this.editGuideForm.value;
    this.guideService.updateGuide(this.selectedGuideId, formData).subscribe({
      next: (data) => {
        this.toastr.success('Se edito el guía con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadGuides();
        this.closeEditGuideModal();
      },
      error: (error) => {
        this.toastr.error('Error al editar el guía', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }
}
