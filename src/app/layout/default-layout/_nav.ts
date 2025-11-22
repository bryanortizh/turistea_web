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
    title: true,
    name: 'Servicio Turistico',
  },

  {
    name: 'Conductores',
    url: '/driver',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Guias Turisticos',
    url: '/guides',
    iconComponent: { name: 'cil-paper-plane' },
  },
  {
    name: 'Ofertas Turisticas',
    url: '/offers',
    iconComponent: { name: 'cil-star' },
  },
  {
    name: 'Terramozas',
    url: '/terraces',
    iconComponent: { name: 'cil-user' },
  },
];

export const navItemsSupport: INavData[] = [
  {
    title: true,
    name: 'Servicio Turistico',
  },
  {
    name: 'Conductores',
    url: '/driver',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Guias Turisticos',
    url: '/guides',
    iconComponent: { name: 'cil-paper-plane' },
  },
  {
    name: 'Terramozas',
    url: '/terraces',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Reservas',
    url: '/reserves',
    iconComponent: { name: 'cil-bookmark' },
  },
];
