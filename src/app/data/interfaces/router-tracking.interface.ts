export interface RouteItem {
  id: number;
  index?: number;
  title: string;
  description: string;
  bg_image?: string;
}

export interface RouterTrackingResponse {
  id: number;
  title: string;
  description: string;
  id_package: number;
  route_json: string;
  key_bgone: string | null;
  key_bgtwo: string | null;
  key_bgthree: string | null;
  path_bgone: string | null;
  path_bgtwo: string | null;
  path_bgthree: string | null;
  size_bgone: string | null;
  size_bgtwo: string | null;
  size_bgthree: string | null;
  name_district: string | null;
  name_province: string | null;
  price_route: string | null;
  address_initial: string | null;
  address_final: string | null;
  state: boolean;
  created: string;
  updated: string;
  created_by: number;
  updated_by: number;
}

export interface ParsedRouterTrackingResponse extends Omit<RouterTrackingResponse, 'route_json'> {
  route_json: RouteItem[];
}

export interface RouterTrackingRequest {
  title: string;
  description: string;
  id_package: number;
  route_json: string;
  name_district?: string;
  name_province?: string;
  image_one?: string;
  image_two?: string;
  image_tree?: string;
}