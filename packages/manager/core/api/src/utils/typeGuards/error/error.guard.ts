import { AxiosError, isAxiosError } from 'axios';
import { TApiCustomError, ApiErrorClass } from '../../../types/error.type';

export const isApiCustomError = (error: unknown): error is TApiCustomError => {
  if (!isAxiosError(error)) return false;

  const axiosError = error as AxiosError;
  const data = axiosError?.response?.data;

  return typeof data === 'object' && 'message' in data && 'class' in data;
};

export const isMaxQuotaReachedError = (error: TApiCustomError) =>
  error.response?.data.class.includes(ApiErrorClass.MaxQuotaReached);
