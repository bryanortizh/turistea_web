import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
   {
    title: true,
    name: 'Metricas',
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
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
    name: 'Guias Turisticos',
    url: '/guides',
    iconComponent: { name: 'cil-star' },
  },
  {
    name: 'Ofertas Turisticas',
    url: '/offers',
    iconComponent: { name: 'cil-star' },
  },
  {
    name: 'Terramozas',
    url: '/terraces',
    iconComponent: { name: 'cil-building' },
  }
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
