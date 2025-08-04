import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    title: true,
    name: 'Modulos',
  },
  {
    name: 'Usuarios',
    url: '/user',
    iconComponent: { name: 'cil-user' },
  },
  /* {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  }, */
];
