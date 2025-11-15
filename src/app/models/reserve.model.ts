export interface Reserve {
  id: number;
  type_document: string;
  number_document: string;
  full_name: string;
  id_user: number;
  id_package: number;
  id_router_tracking: number;
  date_reserve: string;
  cant_people: number;
  users_json: UsersJson;
  guide: boolean;
  terrace: boolean;
  price_total: string;
  status_form: 'pending' | 'approved' | 'rejected';
  state: boolean;
  created: string;
  updated: string | null;
  user: User;
  package: Package;
  router_tracking: RouterTracking;
}

export interface UsersJson {
  passengers: Passenger[];
  emergency_contact: EmergencyContact;
}

export interface Passenger {
  name: string;
  document: string;
  type: string;
  age: number;
  phone: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  cellphone: number;
  dni: string;
}

export interface Package {
  id: number;
  title: string;
  description: string;
  name_region: string;
  quantity_person: string;
}

export interface RouterTracking {
  id: number;
  title: string;
  description: string;
  name_district: string;
  name_province: string;
}
