export interface PackageResponse {
  id: number;
  title: string;
  description: string;
  key: string;
  size: string;
  path_bg: string;
  path_bg_two: string;
  name_district: string;
  name_province: string;
  name_region: string;
  id_driver: number;
  state: boolean;
  created: string | null;
  updated: string | null;
  created_by: number;
  updated_by: number;
}
