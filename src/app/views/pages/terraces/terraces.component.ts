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
import { TerraceServices } from '../../../core/services/terrace.service';
import { TerraceResponse } from '../../../data/interfaces/terrace.interface';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-terrace',
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
  providers: [TerraceServices, HttpClient],
  templateUrl: './terraces.component.html',
  styleUrl: './terraces.component.scss',
  standalone: true,
})
export class TerraceComponent {
  page: number = 1;
  state: number = 1;
  pageTotal: number = 1;
  dataTerrace: TerraceResponse[] = [];
  terraceForm: FormGroup;
  editTerraceForm: FormGroup;
  visibleTerraceModal = false;
  selectedTerrace: any = null;
  visibleAddTerraceModal = false;
  visibleEditTerraceModal = false;
  selectedTerraceId: number = 0;
  timeOutmessage = 5000;
  loading: boolean = false;
  constructor(
    private terraceService: TerraceServices,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.terraceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.minLength(8)]],
      sexo: ['', [Validators.required]],
      image_photo: ['', [Validators.required]],
      image_document: ['', [Validators.required]],
    });

    this.editTerraceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      type_document: ['', [Validators.required]],
      number_document: ['', [Validators.required, Validators.minLength(8)]],
      sexo: ['', [Validators.required]],
      image_photo: [''],
      image_document: [''],
    });
  }

  ngOnInit(): void {
    this.loadTerraces();
  }

  loadTerraces(): void {
    let body: PaginationParams = {
      page: this.page,
      state: this.state,
    };
    const pageSize = 12;
    this.loading = true;
    this.terraceService.getTerrace(body).subscribe({
      next: (data) => {
        this.loading = false;
        let terraceData: Pagination = data as unknown as Pagination;
        this.dataTerrace = terraceData.rows;
        this.pageTotal = Math.ceil(
          (terraceData.count || this.dataTerrace.length) / pageSize
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
    this.loadTerraces();
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.pageTotal || newPage === this.page)
      return;
    this.page = newPage;
    this.loadTerraces();
  }

  openTerraceModal(index: number) {
    this.selectedTerrace = this.dataTerrace[index];
    this.visibleTerraceModal = true;
  }

  closeTerraceModal() {
    this.visibleTerraceModal = false;
    this.selectedTerrace = null;
  }

  blockUser(user: TerraceResponse): void {
    const state =
      this.dataTerrace.find((u) => u.id === user.id)?.state === true
        ? false
        : true;
    this.loading = true;
    this.terraceService.blockTerrace(user, state).subscribe({
      next: (data) => {
        this.loading = false;
        this.toastr.success(
          `Terramozas ${state ? 'desbloqueada' : 'bloqueada'} con éxito`,
          'Éxito',
          {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }
        );
        this.loadTerraces();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error al bloquear la terramozas', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  saveTerrace() {
    this.visibleAddTerraceModal = true;
  }

  closeAddTerraceModal() {
    this.visibleAddTerraceModal = false;
    this.terraceForm.reset();
  }

  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String;

        this.terraceForm.patchValue({
          [fieldName]: base64,
        });
        this.terraceForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitTerrace() {
    if (this.terraceForm.valid) {
      const formData = new FormData();
      Object.keys(this.terraceForm.value).forEach((key) => {
        formData.append(key, this.terraceForm.value[key]);
      });

      this.closeAddTerraceModal();
    } else {
      this.terraceForm.markAllAsTouched();
    }
  }

  createTerrace() {
    if (this.terraceForm.invalid) {
      this.terraceForm.markAllAsTouched();
      return;
    }
    const formData = this.terraceForm.value;
    this.loading = true;
    this.terraceService.createTerrace(formData).subscribe({
      next: (data) => {
        this.loading = false;
        this.toastr.success('Se creo la terramozas con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadTerraces();
        this.closeAddTerraceModal();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error al crear la terramozas', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }

  openEditTerraceModal(index: number) {
    const terrace = this.dataTerrace[index];
    this.selectedTerraceId = terrace.id;

    this.editTerraceForm.patchValue({
      name: terrace.name,
      lastname: terrace.lastname,
      email: terrace.email,
      cellphone: terrace.cellphone,
      type_document: terrace.type_document,
      number_document: terrace.number_document,
      sexo: terrace.sexo,
    });

    this.visibleEditTerraceModal = true;
  }

  closeEditTerraceModal() {
    this.visibleEditTerraceModal = false;
    this.editTerraceForm.reset();
    this.editTerraceForm.markAsUntouched();
    this.selectedTerraceId = 0;
  }

  onFileSelectEdit(event: any, fieldName: string) {
   const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const base64 = base64String.split(',')[1];

        this.editTerraceForm.patchValue({
          [fieldName]: base64,
        });
        this.editTerraceForm.get(fieldName)?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  updateTerrace() {
    if (this.editTerraceForm.invalid) {
      this.editTerraceForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formData = this.editTerraceForm.value;
    this.terraceService.updateTerrace(this.selectedTerraceId, formData).subscribe({
      next: (data) => {
        this.loading = false;
        this.toastr.success('Se edito la terramozas con exito', 'Realizado', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
        this.loadTerraces();
        this.closeEditTerraceModal();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error al editar la terramozas', 'Error', {
          timeOut: this.timeOutmessage,
          closeButton: true,
          progressBar: true,
        });
      },
    });
  }
}