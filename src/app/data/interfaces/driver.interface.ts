export interface DriverResponse {
    id: number;
    name: string;
    lastname: string;
    cellphone: string;
    type_document: string;
    number_document: string;
    number_plate: string;
    brand_car: string;
    model_car: string;
    email: string;
    key: string | null; 
    size: string | null;
    path_car: string | null;
    name_district: string;
    name_province: string;
    name_region: string;
    sexo: string;
    state: boolean;
    created: string; 
    updated: string; 
    created_by: number;
    updated_by: number;
    displayName?: string; // Propiedad opcional para mostrar en ng-select
}