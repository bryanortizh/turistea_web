import { Component, Input, forwardRef, OnInit, OnDestroy, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  standalone: true,
  imports: [NgSelectModule, CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true
    }
  ]
})
export class SearchSelectComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() notFoundText: string = 'No se encontraron resultados';
  @Input() typeToSearchText: string = 'Escribe para buscar...';
  @Input() required: boolean = false;
  @Input() searchFunction!: (term: string) => Observable<any[]>;
  @Input() getAllFunction?: () => Observable<any[]>; // Función para traer todos los items
  @Input() bindLabel: string = 'textSearch';
  @Input() bindValue: string = 'id';
  @Input() minTermLength: number = 2;
  @Input() errorMessage: string = 'Este campo es requerido';
  
  data: any[] = [];
  loading: boolean = false;
  searchInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  value: any = null;
  disabled: boolean = false;
  touched: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term && term.length >= this.minTermLength) {
            this.loading = true;
            return this.searchFunction(term).pipe(
              catchError((error) => {
                console.error('Error en búsqueda:', error);
                this.loading = false;
                return of([]);
              })
            );
          }
          this.data = [];
          this.loading = false;
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results: any[]) => {
          this.data = results;
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Implementación de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
    
    // Si hay un valor inicial y una función para obtener todos los items
    if (value && this.getAllFunction) {
      this.loading = true;
      this.getAllFunction().pipe(
        catchError((error) => {
          console.error('Error al cargar todos los items:', error);
          this.loading = false;
          return of([]);
        })
      ).subscribe((items: any[]) => {
        // Filtrar el item que coincide con el ID
        const selectedItem = items.find(item => item[this.bindValue] === value);
        if (selectedItem) {
          // Agregar solo el item seleccionado al array de datos
          this.data = [selectedItem];
        }
        this.loading = false;
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Implementación de Validator
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !control.value) {
      return { required: true };
    }
    return null;
  }

  // Métodos del componente
  onSearch(term: string): void {
    this.searchInput$.next(term);
  }

  onSelectChange(selectedValue: any): void {
    console.log('Valor seleccionado:', selectedValue);
    this.value = selectedValue.id;
    this.touched = true;
    this.onChange(selectedValue.id);
    this.onTouched();
  }

  onClear(): void {
    this.value = null;
    this.data = [];
    this.touched = true;
    this.onChange(null);
    this.onTouched();
  }

  // Método para verificar si debe mostrar error
  shouldShowError(): boolean {
    return this.touched && this.required && !this.value;
  }
}
