import { AxiosError, AxiosResponse } from 'axios';

export type ApiError = AxiosError<{ message: string }>;
export type ApiResponse<T> = AxiosResponse<T>;
