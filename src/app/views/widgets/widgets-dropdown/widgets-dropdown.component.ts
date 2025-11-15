import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {
  ColComponent,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent,
} from '@coreui/angular';
import { ReportService } from '../../../core/services/report.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReportSummary } from '../../../data/interfaces/report.interface';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  providers: [ReportService, HttpClient],
  imports: [
    RowComponent,
    HttpClientModule,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    ChartjsComponent,
  ],
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() reportSummary: ReportSummary | null = null;

  Math = Math;

  data: any[] = [];
  options: any[] = [];

  reserveStats = {
    total_reserves: 0,
    total_revenue: 0,
    average_price: 0,
    total_people: 0
  };

  statusStats = {
    pending: 0,
    rejected: 0,
    pendingpay: 0,
    reserve: 0,
    inprocesstravel: 0,
    done: 0,
    approved: 0
  };

  userStats = {
    total_users_system: 0,
    percentage_change: 0,
    total_users: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[],
  };
  adminStats = {
    total_users: 0,
    percentage_change: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[],
  };
  driverStats = {
    total_drivers_system: 0,
    total_drivers: 0,
    percentage_change: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[],
  };
  guideStats = {
    total_guides_system: 0,
    percentage_change: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[],
  };
  terraceStats = {
    total_terrace_system: 0,
    total_terrace: 0,
    percentage_change: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[],
  };

  datasets = [
    [
      {
        label: 'Administradores registrados',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [] as number[],
      },
      {
        label: 'Usuarios registrados',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [] as number[],
      },
      {
        label: 'Conductores registrados',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [] as number[],
      },
      {
        label: 'Guías registradas',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [] as number[],
      },
      {
        label: 'Terramozas registradas',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [] as number[],
      },
    ],
  ];

  optionsDefault = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.setData();
    this.getReportUser();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setData() {
    this.data[0] = {
      labels: [],
      datasets: this.datasets[0],
    };
    this.data[1] = {
      labels: [],
      datasets: this.datasets[1],
    };
    this.data[2] = {
      labels: [],
      datasets: this.datasets[2],
    };
    this.data[3] = {
      labels: [],
      datasets: this.datasets[3],
    };
    this.data[4] = {
      labels: [],
      datasets: this.datasets[4],
    };
    this.setOptions();
  }

  setOptions() {
    const adminOptions = JSON.parse(JSON.stringify(this.optionsDefault));
    adminOptions.scales.y.min = 0;
    adminOptions.scales.y.max = undefined;
    adminOptions.elements.line.tension = 0.4;
    adminOptions.elements.point.radius = 3;
    adminOptions.elements.point.hoverRadius = 6;
    this.options[0] = adminOptions;

    const userOptions = JSON.parse(JSON.stringify(this.optionsDefault));
    userOptions.scales.y.min = 0;
    userOptions.scales.y.max = undefined;
    userOptions.elements.line.tension = 0.4;
    userOptions.elements.point.radius = 3;
    userOptions.elements.point.hoverRadius = 6;
    this.options[1] = userOptions;

    const driverOptions = JSON.parse(JSON.stringify(this.optionsDefault));
    driverOptions.scales.y.min = 0;
    driverOptions.scales.y.max = undefined;
    driverOptions.elements.line.tension = 0.4;
    driverOptions.elements.point.radius = 3;
    driverOptions.elements.point.hoverRadius = 6;
    this.options[2] = driverOptions;

    const guideOptions = JSON.parse(JSON.stringify(this.optionsDefault));
    guideOptions.scales.y.min = 0;
    guideOptions.scales.y.max = undefined;
    guideOptions.elements.line.tension = 0.4;
    guideOptions.elements.point.radius = 3;
    guideOptions.elements.point.hoverRadius = 6;
    this.options[3] = guideOptions;

    const terraceOptions = JSON.parse(JSON.stringify(this.optionsDefault));
    terraceOptions.scales.y.min = 0;
    terraceOptions.scales.y.max = undefined;
    terraceOptions.elements.line.tension = 0.4;
    terraceOptions.elements.point.radius = 3;
    terraceOptions.elements.point.hoverRadius = 6;
    this.options[4] = terraceOptions;
  }

  getReportUser(): void {
    this.reportService.getReportUser().subscribe(
      (response) => {
        if (response && response.data) {
          this.adminStats = response.data;
          this.userStats = response.data_user;
          this.terraceStats = response.data_terrace;
          this.driverStats = response.data_drivers;
          this.guideStats = response.data_guides;
          this.updateAdminChart();
          this.updateUserChart();
          this.updateDriverChart();
          this.updateGuideChart();
          this.updateTerraceChart();
        }
      },
      (error) => {
        console.error('Error fetching user report:', error);
      }
    );
  }

  updateAdminChart(): void {
    const sortedData = this.adminStats.monthly_data.sort(
      (a, b) =>
        new Date(a.month + '-01').getTime() -
        new Date(b.month + '-01').getTime()
    );

    const monthLabels = sortedData.map((item) => {
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3);
      const year = parts[1].substring(2);
      return `${month} ${year}`;
    });

    const monthlyUsers = sortedData.map((item) => item.total_users);

    this.datasets[0] = [
      {
        label: 'Administradores registrados',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: monthlyUsers,
      },
    ];

    this.data[0] = {
      labels: monthLabels,
      datasets: this.datasets[0],
    };

    this.changeDetectorRef.detectChanges();
  }

  updateUserChart(): void {
    const sortedData = this.userStats.monthly_data.sort(
      (a, b) =>
        new Date(a.month + '-01').getTime() -
        new Date(b.month + '-01').getTime()
    );

    const monthLabels = sortedData.map((item) => {
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3);
      const year = parts[1].substring(2);
      return `${month} ${year}`;
    });

    const monthlyUsers = sortedData.map((item) => item.total_users);

    const userDataset = [
      {
        label: 'Usuarios del sistema',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-info'),
        pointHoverBorderColor: getStyle('--cui-info'),
        data: monthlyUsers,
      },
    ];

    this.data[1] = {
      labels: monthLabels,
      datasets: userDataset,
    };

    this.changeDetectorRef.detectChanges();
  }

  updateTerraceChart(): void {
    const sortedData = this.terraceStats.monthly_data.sort(
      (a, b) =>
        new Date(a.month + '-01').getTime() -
        new Date(b.month + '-01').getTime()
    );

    const monthLabels = sortedData.map((item) => {
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3);
      const year = parts[1].substring(2);
      return `${month} ${year}`;
    });

    const monthlyTerraces = sortedData.map((item) => item.total_terrace);

    const terraceDataset = [
      {
        label: 'Terramozas del sistema',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-success'),
        pointHoverBorderColor: getStyle('--cui-success'),
        data: monthlyTerraces,
      },
    ];

    this.data[4] = {
      labels: monthLabels,
      datasets: terraceDataset,
    };

    this.changeDetectorRef.detectChanges();
  }

  updateDriverChart(): void {
    const sortedData = this.driverStats.monthly_data.sort(
      (a, b) =>
        new Date(a.month + '-01').getTime() -
        new Date(b.month + '-01').getTime()
    );

    const monthLabels = sortedData.map((item) => {
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3);
      const year = parts[1].substring(2);
      return `${month} ${year}`;
    });

    const monthlyDrivers = sortedData.map((item) => item.total_drivers);

    const driverDataset = [
      {
        label: 'Conductores del sistema',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-warning'),
        pointHoverBorderColor: getStyle('--cui-warning'),
        data: monthlyDrivers,
      },
    ];
    this.data[2] = {
      labels: monthLabels,
      datasets: driverDataset,
    };

    this.changeDetectorRef.detectChanges();
  }

  updateGuideChart(): void {
    const sortedData = this.guideStats.monthly_data.sort(
      (a, b) =>
        new Date(a.month + '-01').getTime() -
        new Date(b.month + '-01').getTime()
    );

    const monthLabels = sortedData.map((item) => {
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3);
      const year = parts[1].substring(2);
      return `${month} ${year}`;
    });

    const monthlyGuides = sortedData.map((item) => item.total_guides);
    const guideDataset = [
      {
        label: 'Guías del sistema',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-danger'),
        pointHoverBorderColor: getStyle('--cui-danger'),
        data: monthlyGuides,
      },
    ];
    this.data[3] = {
      labels: monthLabels,
      datasets: guideDataset,
    };

    this.changeDetectorRef.detectChanges();
  }
}
