import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout').then((m) => m.DefaultLayoutComponent),
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./views/pages/user/user.component').then(
            (m) => m.UserComponent
          ),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./views/pages/user-client/user-client.component').then(
            (m) => m.UserClientComponent
          ),
      },
      {
        path: 'driver',
        loadComponent: () =>
          import('./views/pages/driver/driver.component').then(
            (m) => m.DriverComponent
          ),
      },
      {
        path: 'guides',
        loadComponent: () =>
          import('./views/pages/guides/guides.component').then(
            (m) => m.GuideComponent
          ),
      },
      {
        path: 'offers',
        loadComponent: () =>
          import('./views/pages/offerts/offerts.component').then(
            (m) => m.OffertsComponent
          ),
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'login' },
];
