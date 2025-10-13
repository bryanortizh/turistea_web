export interface Profile {
  name: string;
  lastname: string;
  path: string;
  email: string;
  created: string | null;
  admin_role?: {
    id: number;
    rol: string;
  };
}
