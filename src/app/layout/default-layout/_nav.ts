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
    name: 'Administradores',
    url: '/admin',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Usuarios',
    url: '/user',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Conductores',
    url: '/driver',
    iconComponent: { name: 'cil-car' },
  },
  {
    name: 'Ofertas Turisticas',
    url: '/offers',
    iconComponent: { name: 'cil-star' },
  },
];

export const navItemsSupport: INavData[] = [
  {
    title: true,
    name: 'Modulos',
  },
  {
    name: 'Conductores',
    url: '/driver',
    iconComponent: { name: 'cil-car' },
  },
];

export const navItemsDriver: INavData[] = [
  {
    title: true,
    name: 'Modulos',
  },
  {
    name: 'Ofertas Turisticas',
    url: '/offers',
    iconComponent: { name: 'cil-star' },
  },
];
