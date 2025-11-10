import { NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  DOCUMENT,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressComponent,
  RowComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { ReportService } from '../../core/services/report.service';
import { HttpClient } from '@angular/common/http';
import {
  ReportResponse,
  ReportSummary,
} from '../../data/interfaces/report.interface';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [ReportService, HttpClient],
  imports: [
    WidgetsDropdownComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressComponent,
  ],
})
export class DashboardComponent implements OnInit {
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  public dateText: string = 'Últimos 12 meses';
  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('years'),
  });
  public reportSummary: ReportSummary | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.getReportReserve('years');
  }

  private updateDateText(filter: string, periodLimit: number): void {
    const filterMap: { [key: string]: string } = {
      'days': 'días',
      'months': 'meses', 
      'years': 'meses'
    };

    const period = filterMap[filter] || 'períodos';
    this.dateText = `Últimos ${periodLimit} ${period}`;
  }

  getReportReserve(filter: string): void {
    this.reportService.getReportReserve(filter).subscribe({
      next: (data: ReportResponse) => {
        this.updateDateText(filter, data.period_limit);
        this.updateChartsWithReportData(data);
      },
      error: (error) => {
        console.error(
          'Error al obtener el reporte de reservas turísticas:',
          error
        );
      },
    });
  }

  private updateChartsWithReportData(reportData: ReportResponse): void {
    // Actualizar el resumen para los widgets
    this.reportSummary = reportData.summary;

    // Procesar los datos del reporte para el gráfico principal
    const periodData = reportData.period_stats;

    // Validar que hay datos para procesar
    if (!periodData || periodData.length === 0) {
      console.warn('No hay datos de período para mostrar en el gráfico');
      return;
    }

    // Mapeo manual de meses en español
    const monthNames = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];

    // Extraer las etiquetas (períodos)
    const labels = periodData.map((period) => {
      // El formato viene como "2025-01", "2025-02", etc.
      const [year, monthStr] = period.reservation_period.split('-');
      const monthIndex = parseInt(monthStr) - 1; // Convertir a índice 0-11
      const monthName = monthNames[monthIndex];
      return `${monthName} ${year}`;
    });

    // Datos para el gráfico con validación de valores nulos/undefined
    const totalReserves = periodData.map(
      (period) => period.total_reserves || 0
    );
    const pendingReserves = periodData.map((period) =>
      parseInt(period.pending_reserves || '0')
    );
    const approvedReserves = periodData.map((period) =>
      parseInt(period.approved_reserves || '0')
    );
    const inProcessReserves = periodData.map((period) =>
      parseInt(period.inprocesstravel_reserves || '0')
    );
    const doneReserves = periodData.map((period) =>
      parseInt(period.done_reserves || '0')
    );
    const rejectedReserves = periodData.map((period) =>
      parseInt(period.rejected_reserves || '0')
    );
    const pendingPayReserves = periodData.map((period) =>
      parseInt(period.pendingpay_reserves || '0')
    );
    const reserveReserves = periodData.map((period) =>
      parseInt(period.reserve_reserves || '0')
    );

    // Detener el gráfico actual si existe
    if (this.mainChartRef()) {
      this.mainChartRef().stop();
    }

    // Actualizar el gráfico con datos reales
    this.#chartsData.updateMainChartWithData(labels, {
      totalReserves,
      pendingReserves,
      approvedReserves,
      inProcessReserves,
      doneReserves,
      rejectedReserves,
      pendingPayReserves,
      reserveReserves,
    });

    // Esperar un poco más para asegurar que el DOM esté listo
    setTimeout(() => {
      this.initCharts();
    }, 300);
  }
  initCharts(): void {
    try {
      // Detener el gráfico anterior si existe
      if (this.mainChartRef()) {
        this.mainChartRef().stop();
      }

      // Actualizar con los nuevos datos
      this.mainChart = { ...this.#chartsData.mainChart };

      // Validar que los datos del gráfico están listos
      if (
        this.mainChart.data &&
        this.mainChart.data.datasets &&
        this.mainChart.data.labels
      ) {
      } else {
        console.warn('Los datos del gráfico no están completos');
      }
    } catch (error) {
      console.error('Error al inicializar el gráfico:', error);
    }
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });

    // Mapear los valores del formulario a los filtros del API
    const filterMapping: { [key: string]: string } = {
      Month: 'months',
      Week: 'weeks',
      Day: 'days',
    };

    const apiFilter = filterMapping[value] || 'months';
    this.getReportReserve(apiFilter);
  }

  handleChartRef($chartRef: any) {
    if ($chartRef && typeof $chartRef === 'object') {
      this.mainChartRef.set($chartRef);

      // Inicializar los estilos después de establecer la referencia
      setTimeout(() => {
        this.setChartStyles();
      }, 200);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(
      this.#document.documentElement,
      'ColorSchemeChange',
      () => {
        this.setChartStyles();
      }
    );

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef() && this.mainChartRef().options) {
      setTimeout(() => {
        try {
          const options: ChartOptions = { ...this.mainChart.options };
          const scales = this.#chartsData.getScales();

          if (
            this.mainChartRef().options &&
            this.mainChartRef().options.scales
          ) {
            this.mainChartRef().options.scales = {
              ...options.scales,
              ...scales,
            };
            this.mainChartRef().update();
          }
        } catch (error) {
          console.error('Error al actualizar estilos del gráfico:', error);
        }
      }, 100);
    }
  }
}
