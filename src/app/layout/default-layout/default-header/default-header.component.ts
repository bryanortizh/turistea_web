import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ButtonCloseDirective,
  ButtonDirective,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  SidebarToggleDirective,
} from '@coreui/angular';

import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { ProfileService } from '../../../core/services/profile.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Profile } from '../../../data/interfaces/profile.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
  imports: [
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NgTemplateOutlet,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    HttpClientModule,
    CommonModule,
    ModalComponent,
    ModalHeaderComponent,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ReactiveFormsModule,
    ButtonDirective,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
  ],
  providers: [ProfileService, HttpClient, IconSetService],
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  visiblePassword = false;
  showOld = false;
  showNew = false;
  showRepeat = false;
  passwordForm: FormGroup;
  dataUser: Profile = {} as Profile;
  sidebarId = input('sidebar1');
  showSuccess = false;
  timeOutmessage = 5000;
  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' },
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return (
      this.colorModes.find((mode) => mode.name === currentMode)?.icon ??
      'cilSun'
    );
  });

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    super();
    this.getProfile();
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: async (userResponse: Profile) => {
        this.dataUser = userResponse;
      },
      error: (error) => {
        console.log(error);
        
      },
    });
  }

  closeSession() {
    this.profileService.closeSession().subscribe({
      next: () => {
        this.toastr.success('Sesión cerrada con éxito', 'Realizado');
        localStorage.removeItem('token_turistea');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastr.success('Sesión cerrada con éxito', 'Realizado');
        localStorage.removeItem('token_turistea');
        this.router.navigate(['/login']);
      },
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;
    return newPassword === repeatPassword ? null : { passwordMismatch: true };
  }

  handlePasswordModalChange(event: boolean) {
    console.log('event', event);
    this.visiblePassword = event;
  }

  openModalPassword() {
    this.visiblePassword = true;
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    }, 500);
  }

  closePasswordModal() {
    this.visiblePassword = false;
    this.passwordForm.reset();
    this.showOld = false;
    this.showNew = false;
    this.showRepeat = false;
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      this.profileService
        .updatePassword(
          this.passwordForm.get('oldPassword')?.value,
          this.passwordForm.get('newPassword')?.value
        )
        .subscribe({
          next: (response) => {
            this.toastr.success(
              'Se actualizo la contraseña con exito',
              'Realizado',
              {
                timeOut: this.timeOutmessage,
                closeButton: true,
                progressBar: true,
              }
            );
            this.closePasswordModal();
          },
          error: (error) => {
            const errors = error?.error?.errors;
            if (Array.isArray(errors) && errors.length > 1) {
              errors.forEach((err: any) => {
                this.toastr.error(err.msg, 'Error', {
                  timeOut: this.timeOutmessage,
                  closeButton: true,
                  progressBar: true,
                });
              });
            } else if (Array.isArray(errors) && errors.length === 1) {
              this.toastr.error(errors[0].msg, 'Error', {
                timeOut: this.timeOutmessage,
                closeButton: true,
                progressBar: true,
              });
            } else {
              this.toastr.error(
                error.error.message || 'Error desconocido',
                'Error',
                {
                  timeOut: this.timeOutmessage,
                  closeButton: true,
                  progressBar: true,
                }
              );
            }
          },
        });
    }
  }
}
