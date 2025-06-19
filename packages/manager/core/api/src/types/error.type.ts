import { AxiosError } from 'axios';

export enum TErrorClass {
  MaxQuotaReached = 'MaxQuotaReached',
}
export type DataResponse = {
  class: string;
  message: string;
};

export type AxiosCustomError = AxiosError<DataResponse>;
