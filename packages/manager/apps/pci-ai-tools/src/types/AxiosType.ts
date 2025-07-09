import type { AxiosResponse } from 'axios';

export type AxiosResponseType<T> = AxiosResponse<T>;

export type AxiosVoidType = Promise<AxiosResponseType<void>>;
