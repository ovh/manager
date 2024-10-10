export type Handler<T = any> = {
  url: string;
  response?: T;
  headers?: HeadersInit;
  statusText?: string;
  type?: ResponseType;
  responseText?: string;
  delay?: number;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'all'
    | 'head'
    | 'options'
    | 'patch';
  status?: number;
  api?: 'v2' | 'v6' | 'aapi' | 'ws';
  baseUrl?: string;
  disabled?: boolean;
  once?: boolean;
};
