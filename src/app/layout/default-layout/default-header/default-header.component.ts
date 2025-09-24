import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
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
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { ProfileService } from '../../../data/services/profile.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Profile } from '../../../data/interfaces/profile.interface';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
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
  ],
  providers: [ProfileService, HttpClient],
})
export class DefaultHeaderComponent extends HeaderComponent {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

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

  constructor(private router: Router, private profileService: ProfileService) {
    super();
    this.getProfile();
  }

  dataUser: Profile = {} as Profile;
  sidebarId = input('sidebar1');

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: async (userResponse: Profile) => {
        console.log(userResponse);
        this.dataUser = userResponse;
      },
      error: (error) => {
        console.log(error);
        /*  this.toastr.error(error.error.message, 'Acceso denegado', {
            timeOut: environment.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }); */
      },
    });
  }

  closeSession() {
    this.profileService.closeSession().subscribe({
      next: () => {
        localStorage.removeItem('token_turistea');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token_turistea');
        this.router.navigate(['/login']);
      },
    });
  }
}
