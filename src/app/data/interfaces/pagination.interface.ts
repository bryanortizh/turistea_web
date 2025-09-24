export interface Pagination {
  rows: [];
  count: number;
  page: number;
}

export interface PaginationParams {
  page?: number;
  state?: number;
}
