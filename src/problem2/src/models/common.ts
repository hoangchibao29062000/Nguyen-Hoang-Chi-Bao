export interface PaginationParams {
  _limit: number;
  _page: number;
  _total: number;
}

export interface ListParams {
  _limit?: number;
  _page?: number;
  _sort?: string;
  _order?: 'asc' | 'desc';

  [key: string]: any;
}

export interface ListResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface ListDataResponse<T> {
  data: T[];
  message: string;
  status: number;
}

export interface DataResponse<T> {
  data?: T | any;
  message: string;
  status: number;
}
