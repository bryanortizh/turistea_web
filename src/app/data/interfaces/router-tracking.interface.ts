// Interface para las rutas individuales dentro del JSON
export interface RouteItem {
  id: number;
  index?: number;
  title: string;
  description: string;
  bg_image?: string;
}

// Interface principal para la respuesta del router tracking
export interface RouterTrackingResponse {
  id: number;
  title: string;
  description: string;
  id_package: number;
  route_json: string; // JSON stringificado que contiene RouteItem[]
  
  // Imágenes principales
  key_bgone: string | null;
  key_bgtwo: string | null;
  key_bgthree: string | null;
  
  // URLs de las imágenes
  path_bgone: string | null;
  path_bgtwo: string | null;
  path_bgthree: string | null;
  
  // Tamaños de las imágenes
  size_bgone: string | null;
  size_bgtwo: string | null;
  size_bgthree: string | null;
  
  // Ubicación (pueden ser null)
  name_district: string | null;
  name_province: string | null;
  
  // Estado y metadatos
  state: boolean;
  created: string;
  updated: string;
  created_by: number;
  updated_by: number;
}

// Interface para cuando parseamos el route_json
export interface ParsedRouterTrackingResponse extends Omit<RouterTrackingResponse, 'route_json'> {
  route_json: RouteItem[]; // Array parseado en lugar de string
}

// Interface para la creación/edición (sin campos de respuesta del servidor)
export interface RouterTrackingRequest {
  title: string;
  description: string;
  id_package: number;
  route_json: string; // JSON stringificado
  name_district?: string;
  name_province?: string;
  image_one?: string; // Base64 de la imagen principal
  image_two?: string; // Base64 de la imagen secundaria
  image_tree?: string; // Base64 de la imagen adicional
}