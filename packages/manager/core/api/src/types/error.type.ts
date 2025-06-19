import { AxiosError } from 'axios';

export enum ApiErrorClass {
  MaxQuotaReached = 'MaxQuotaReached',
}
export type TApiDataResponse = {
  class: string;
  message: string;
};

export type TApiCustomError = AxiosError<TApiDataResponse>;
