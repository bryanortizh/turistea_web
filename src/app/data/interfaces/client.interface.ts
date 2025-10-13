export interface ClientResponse {
  id: number;
  user_session_day: number | null;
  terms_and_conditions: number;
  date_user_session_day: string | null;
  device_id: string | null;
  name: string;
  code_verification: string;
  date_of_birth: string;
  lastname: string;
  email: string;
  cellphone: number;
  dni: number;
  created: string | null;
  updated: string | null;
  sexo: string;
  number_of_sessions: number;
  originalname: string | null;
  filename: string | null;
  size: number | null;
  ext: string | null;
  key: string | null;
  path: string | null;
  origin: string;
}
