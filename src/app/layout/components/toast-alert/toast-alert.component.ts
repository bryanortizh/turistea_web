import { Component, Input, signal } from '@angular/core';
import {
  ButtonDirective,
  ProgressComponent,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToasterPlacement,
  ToastHeaderComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-toast-alert',
  imports: [
    ToasterComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,
  ],
  templateUrl: './toast-alert.component.html',
  styleUrl: './toast-alert.component.scss',
  standalone: true,
})
export class ToastAlertComponent {
  position = 'top-end';
  placement = ToasterPlacement.TopEnd;

  @Input() visible: boolean = false;
  @Input() percentage: number = 0;
  @Input() message: string = '';

  visibleSignal = signal(this.visible);
  percentageSignal = signal(this.percentage);

  ngOnChanges() {
    this.visibleSignal.set(this.visible);
    this.percentageSignal.set(this.percentage);
  }

  toggleToast() {
    this.visibleSignal.update((value) => !value);
  }

  onVisibleChange($event: boolean) {
    this.visibleSignal.set($event);
    this.percentageSignal.set(
      this.visibleSignal() ? this.percentageSignal() : 0
    );
  }

  onTimerChange($event: number) {
    this.percentageSignal.set($event * 25);
  }
}
