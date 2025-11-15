# Search Select Component

Componente reutilizable para búsqueda con ng-select que incluye debounce, carga lazy y validación.

## Uso

### 1. Importar el componente en tu módulo/componente

```typescript
import { SearchSelectComponent } from '../../components/search-select/search-select.component';

@Component({
  imports: [
    // ... otros imports
    SearchSelectComponent
  ]
})
```

### 2. Usar en el template

```html
<app-search-select
  label="Conductor"
  formControlName="id_driver"
  [searchFunction]="searchDrivers.bind(this)"
  placeholder="Buscar conductor por nombre..."
  notFoundText="No se encontraron conductores"
  typeToSearchText="Escribe para buscar..."
  bindLabel="textSearch"
  bindValue="id"
  [required]="true"
  [minTermLength]="2"
  errorMessage="El conductor es requerido">
</app-search-select>
```

### 3. Definir la función de búsqueda en el componente TypeScript

```typescript
export class YourComponent {
  constructor(private driverService: DriverService) {}

  // Función de búsqueda que retorna un Observable
  searchDrivers(term: string): Observable<any[]> {
    return this.driverService.searchDriver(term);
  }
  
  // Para guías
  searchGuides(term: string): Observable<any[]> {
    return this.guideService.searchGuide(term);
  }
  
  // Para terrazas
  searchTerraces(term: string): Observable<any[]> {
    return this.terraceService.searchTerrace(term);
  }
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | string | '' | Etiqueta del campo |
| `formControlName` | string | - | Nombre del control en el FormGroup |
| `searchFunction` | (term: string) => Observable<any[]> | - | **Requerido**. Función que ejecuta la búsqueda |
| `placeholder` | string | 'Buscar...' | Texto del placeholder |
| `notFoundText` | string | 'No se encontraron resultados' | Texto cuando no hay resultados |
| `typeToSearchText` | string | 'Escribe para buscar...' | Texto de ayuda |
| `bindLabel` | string | 'textSearch' | Campo a mostrar en el select |
| `bindValue` | string | 'id' | Campo a usar como valor |
| `required` | boolean | false | Si el campo es requerido |
| `minTermLength` | number | 2 | Mínimo de caracteres para buscar |
| `errorMessage` | string | 'Este campo es requerido' | Mensaje de error cuando está vacío |

## Ejemplo completo para Conductor, Guía y Terraza

```html
<!-- En el formulario de creación -->
<form [formGroup]="packageForm">
  <div class="row">
    <!-- Conductor -->
    <div class="col-md-12">
      <app-search-select
        label="Conductor"
        formControlName="id_driver"
        [searchFunction]="searchDrivers.bind(this)"
        placeholder="Buscar conductor por nombre..."
        notFoundText="No se encontraron conductores"
        bindLabel="textSearch"
        bindValue="id"
        [required]="true"
        errorMessage="El conductor es requerido">
      </app-search-select>
    </div>

    <!-- Guía -->
    <div class="col-md-12">
      <app-search-select
        label="Guía"
        formControlName="id_guide"
        [searchFunction]="searchGuides.bind(this)"
        placeholder="Buscar guía por nombre..."
        notFoundText="No se encontraron guías"
        bindLabel="textSearch"
        bindValue="id"
        [required]="true"
        errorMessage="El guía es requerido">
      </app-search-select>
    </div>

    <!-- Terraza -->
    <div class="col-md-12">
      <app-search-select
        label="Terraza"
        formControlName="id_terrace"
        [searchFunction]="searchTerraces.bind(this)"
        placeholder="Buscar terraza por nombre..."
        notFoundText="No se encontraron terrazas"
        bindLabel="textSearch"
        bindValue="id"
        [required]="true"
        errorMessage="La terraza es requerida">
      </app-search-select>
    </div>
  </div>
</form>
```

```typescript
export class OffertsComponent {
  packageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private guideService: GuideService,
    private terraceService: TerraceService
  ) {
    this.packageForm = this.fb.group({
      title: ['', [Validators.required]],
      id_driver: ['', [Validators.required]],
      id_guide: ['', [Validators.required]],
      id_terrace: ['', [Validators.required]],
      // ... otros campos
    });
  }

  // Funciones de búsqueda
  searchDrivers(term: string): Observable<DriverResponse[]> {
    return this.driverService.searchDriver(term);
  }

  searchGuides(term: string): Observable<GuideResponse[]> {
    return this.guideService.searchGuide(term);
  }

  searchTerraces(term: string): Observable<TerraceResponse[]> {
    return this.terraceService.searchTerrace(term);
  }
}
```

## Ventajas

- ✅ **Reutilizable**: Un solo componente para todos los selectores con búsqueda
- ✅ **Validación integrada**: Maneja automáticamente la validación required
- ✅ **Debounce automático**: 300ms de espera para optimizar llamadas al servidor
- ✅ **Control de errores**: Maneja errores de búsqueda automáticamente
- ✅ **TypeScript**: Completamente tipado
- ✅ **Standalone**: No requiere módulos adicionales
- ✅ **Limpio**: Reduce significativamente el código del componente padre
