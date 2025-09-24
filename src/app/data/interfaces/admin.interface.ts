
export interface AdminResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  cellphone: number;
  created: string | null;
  updated: string | null;
  admin_role: {
    id: number;
    rol: string;
  };
}
