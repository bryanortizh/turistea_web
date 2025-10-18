import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems, navItemsDriver, navItemsSupport } from './_nav';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../data/interfaces/profile.interface';
import { HttpClient } from '@angular/common/http';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
  ],
  providers: [ProfileService, HttpClient],
})
export class DefaultLayoutComponent {
  public navItems = [];
  dataUser!: Profile;

  constructor(private profileService: ProfileService) {
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: async (userResponse: Profile) => {
        this.dataUser = userResponse;
        this.setNavItems(this.dataUser);
      },
    });
  }

  setNavItems(user: Profile) {
    const role = user?.admin_role?.rol || '';
    switch (role) {
      case 'Super Admin':
        this.navItems = [...navItems] as unknown as [];
        break;
      case 'Administrador':
        this.navItems = [...navItems] as unknown as [];
        break;
      case 'Soporte':
        this.navItems = [...navItemsSupport] as unknown as [];
        break;
      case 'Conductores':
        this.navItems = [...navItemsDriver] as unknown as [];
        break;
      default:
        this.navItems = [];
    }
  }
}
