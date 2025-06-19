import { AxiosError, isAxiosError } from 'axios';
import {
  AxiosCustomError,
  DataResponse,
  TErrorClass,
} from '../../types/error.type';

export const isApiErrorResponse = (
  error: unknown,
): error is AxiosError<DataResponse> => {
  if (!isAxiosError(error)) return false;

  const axiosError = error as AxiosCustomError;
  const data = axiosError?.response?.data;

  return typeof data === 'object' && 'message' in data && 'class' in data;
};

export const isMaxQuotaReachedError = (error: AxiosCustomError) =>
  error.response.data.class.includes(TErrorClass.MaxQuotaReached);
