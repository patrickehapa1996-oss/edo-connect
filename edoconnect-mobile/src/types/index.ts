export * from './user';

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
