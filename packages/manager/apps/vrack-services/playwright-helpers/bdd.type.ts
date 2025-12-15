import { World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export type DefaultTestContext = {
  initialUrl?: string;
  errorMessage?: string;
  message?: string;
  data: Record<string, any>;
};
export interface ICustomWorld<
  HandlerConfig = unknown,
  TestContext = DefaultTestContext & unknown
> extends World {
  context?: BrowserContext;
  page: Page;
  handlersConfig: HandlerConfig;
  testContext: TestContext;
}

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
