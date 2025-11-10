import { Injectable } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType, PluginOptionsByType, ScaleOptions, TooltipLabelStyle } from 'chart.js';
import { DeepPartial } from './utils';
import { getStyle } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {
    // Solo inicializar el gráfico básico sin datos
    // Los datos reales se establecerán mediante updateMainChartWithData
    this.mainChart.type = 'line';
    this.mainChart.data = {
      datasets: [],
      labels: []
    };
    this.mainChart.options = this.getBasicOptions();
  }

  private getBasicOptions(): ChartOptions {
    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          color: getStyle('--cui-body-color')
        }
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    const scales = this.getScales();

    return {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 6,
          hoverBorderWidth: 3
        }
      }
    };
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: 250,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5)
        }
      }
    };
    return scales;
  }

  updateMainChartWithData(labels: string[], chartData: { 
    totalReserves: number[], 
    pendingReserves: number[], 
    approvedReserves: number[], 
    inProcessReserves: number[], 
    doneReserves: number[], 
    rejectedReserves: number[], 
    pendingPayReserves: number[], 
    reserveReserves: number[] 
  }) {
    // Validar que los datos no estén vacíos
    if (!labels || labels.length === 0) {
      console.warn('No hay etiquetas para el gráfico');
      return;
    }
    
    if (!chartData || Object.keys(chartData).length === 0) {
      console.warn('No hay datos para el gráfico');
      return;
    }
    const brandPrimary = getStyle('--cui-primary') ?? '#321fdb';
    const brandSuccess = getStyle('--cui-success') ?? '#2eb85c';
    const brandInfo = getStyle('--cui-info') ?? '#39f';
    const brandWarning = getStyle('--cui-warning') ?? '#f9b115';
    const brandDanger = getStyle('--cui-danger') ?? '#e55353';
    const brandSecondary = getStyle('--cui-secondary') ?? '#6c757d';
    const brandDark = getStyle('--cui-dark') ?? '#212529';
    const brandLight = getStyle('--cui-light') ?? '#f8f9fa';

    const colors = [
      {
        // Total Reservas - Azul primario
        backgroundColor: `rgba(${getStyle('--cui-primary-rgb')}, .1)`,
        borderColor: brandPrimary,
        pointHoverBackgroundColor: brandPrimary,
        borderWidth: 3,
        fill: true
      },
      {
        // Pendientes - Amarillo/Naranja
        backgroundColor: 'transparent',
        borderColor: brandWarning,
        pointHoverBackgroundColor: brandWarning,
        borderWidth: 2
      },
      {
        // Aprobadas - Verde
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: brandSuccess,
        borderWidth: 2
      },
      {
        // En proceso de viaje - Azul info
        backgroundColor: 'transparent',
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        borderDash: [5, 3]
      },
      {
        // Completadas - Verde oscuro
        backgroundColor: 'transparent',
        borderColor: brandDark,
        pointHoverBackgroundColor: brandDark,
        borderWidth: 2
      },
      {
        // Rechazadas - Rojo
        backgroundColor: 'transparent',
        borderColor: brandDanger,
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 2,
        borderDash: [3, 3]
      },
      {
        // Pendientes de pago - Gris
        backgroundColor: 'transparent',
        borderColor: brandSecondary,
        pointHoverBackgroundColor: brandSecondary,
        borderWidth: 2
      },
      {
        // Reservadas - Celeste claro
        backgroundColor: 'transparent',
        borderColor: brandLight,
        pointHoverBackgroundColor: brandLight,
        borderWidth: 2
        
      }
    ];

    const datasets: ChartDataset[] = [
      {
        data: chartData.totalReserves,
        label: 'Total Reservas',
        ...colors[0]
      },
      {
        data: chartData.pendingReserves,
        label: 'Pendientes',
        ...colors[1]
      },
      {
        data: chartData.approvedReserves,
        label: 'Aprobadas',
        ...colors[2]
      },
      {
        data: chartData.inProcessReserves,
        label: 'En Proceso de Viaje',
        ...colors[3]
      },
      {
        data: chartData.doneReserves,
        label: 'Completadas',
        ...colors[4]
      },
      {
        data: chartData.rejectedReserves,
        label: 'Rechazadas',
        ...colors[5]
      },
      {
        data: chartData.pendingPayReserves,
        label: 'Pendientes de Pago',
        ...colors[6]
      },
      {
        data: chartData.reserveReserves,
        label: 'Reservadas',
        ...colors[7]
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          color: getStyle('--cui-body-color')
        }
      },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle),
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.formattedValue;
            return label;
          }
        }
      }
    };

    const scales = this.getScales();
    
    // Ajustar la escala Y para acomodar mejor los datos
    const allValues = [
      ...chartData.totalReserves,
      ...chartData.pendingReserves,
      ...chartData.approvedReserves,
      ...chartData.inProcessReserves,
      ...chartData.doneReserves,
      ...chartData.rejectedReserves,
      ...chartData.pendingPayReserves,
      ...chartData.reserveReserves
    ];
    
    const maxValue = Math.max(...allValues);
    
    scales.y.max = Math.ceil(maxValue * 1.2);
    scales.y.ticks.stepSize = Math.ceil(scales.y.max / 5);

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 6,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
  }
}
