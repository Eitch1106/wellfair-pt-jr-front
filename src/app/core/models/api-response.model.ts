
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PagedResponse<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}
