import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  ColComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent,
} from '@coreui/angular';
import { ReportService } from '../../../core/services/report.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    ChartjsComponent,
  ],
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  data: any[] = [];
  options: any[] = [];

  // Propiedades para datos de usuarios
  userStats = {
    total_users: 0,
    percentage_change: 0,
    current_month_users: 0,
    previous_month_users: 0,
    monthly_data: [] as any[]
  };

  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  datasets = [
    [
      {
        label: 'My First dataset',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        data: [65, 59, 84, 84, 51, 55, 40],
      },
    ],
    [
      {
        label: 'My Second dataset',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-info'),
        pointHoverBorderColor: getStyle('--cui-info'),
        data: [1, 18, 9, 17, 34, 22, 11],
      },
    ],
    [
      {
        label: 'My Third dataset',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-warning'),
        pointHoverBorderColor: getStyle('--cui-warning'),
        data: [78, 81, 80, 45, 34, 12, 40],
        fill: true,
      },
    ],
    [
      {
        label: 'My Fourth dataset',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
        barPercentage: 0.7,
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
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx],
      };
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          // Configuración específica para el gráfico de usuarios
          options.scales.y.min = 0;
          options.scales.y.max = undefined; // Permitir que se ajuste automáticamente
          options.elements.line.tension = 0.4;
          options.elements.point.radius = 3;
          options.elements.point.hoverRadius = 6;
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = {
            display: false,
            drawTicks: false,
            drawBorder: false,
          };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }

  getReportUser(): void {
    this.reportService.getReportUser().subscribe(
      (response) => {
        if (response && response.data) {
          this.userStats = response.data;
          this.updateUserChart();
        }
      },
      (error) => {
        console.error('Error fetching user report:', error);
      }
    );
  }

  updateUserChart(): void {
    
    // Asegurarse de que tenemos datos y ordenarlos por fecha
    const sortedData = this.userStats.monthly_data
      .sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime());
    
    // Usar month_name que ya viene formateado del API, pero acortarlo
    const monthLabels = sortedData.map(item => {
      // Extraer solo el mes y año abreviado de "June 2025" -> "Jun 25"
      const parts = item.month_name.split(' ');
      const month = parts[0].substring(0, 3); // Primeras 3 letras del mes
      const year = parts[1].substring(2); // Últimos 2 dígitos del año
      return `${month} ${year}`;
    });
    
    const monthlyUsers = sortedData.map(item => item.total_users);
    
    this.datasets[0] = [
      {
        label: 'Usuarios registrados',
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
}

/* @Component({
  selector: 'app-chart-sample',
  template:
    '<c-chart type="line" [data]="data" [options]="options" width="300" #chart />',
  imports: [ChartjsComponent],
})
export class ChartSample implements AfterViewInit {
  constructor() {}

  readonly chartComponent = viewChild.required<ChartjsComponent>('chart');

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff',
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [
      {
        data: [65, 59, 84, 84, 51, 55, 40],
        ...this.colors,
        fill: { value: 65 },
      },
    ],
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = () => {
        return {
          ...this.data,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              ...this.data.datasets[0],
              data: [42, 88, 42, 66, 77],
              fill: { value: 55 },
            },
            {
              ...this.data.datasets[0],
              borderColor: '#ffbd47',
              data: [88, 42, 66, 77, 42],
            },
          ],
        };
      };
      const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const newData = [42, 88, 42, 66, 77];
      let { datasets, labels } = { ...this.data };
      // @ts-ignore
      const before = this.chartComponent()?.chart?.data.datasets.length;
      // @ts-ignore
      // this.data = data()
      this.data = {
        ...this.data,
        datasets: [
          { ...this.data.datasets[0], data: newData },
          {
            ...this.data.datasets[0],
            borderColor: '#ffbd47',
            data: [88, 42, 66, 77, 42],
          },
        ],
        labels: newLabels,
      };
      // @ts-ignore
      setTimeout(() => {
        const after = this.chartComponent()?.chart?.data.datasets.length;
      });
    }, 5000);
  }
}
 */