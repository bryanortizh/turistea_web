export interface TerraceResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  type_document: string;
  number_document: string;
  cellphone: string;
  sexo: string;
  state: boolean;
  created_by: number;
  updated_by: number;
  created: Date;
  updated: Date;
  path_document: string;
  key_document: string;
  size_document: string;
  path_photo: string;
  key_photo: string;
  size_photo: string;
}