import { IWorldOptions, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export type DefaultTestContext = {
  initialUrl?: string;
  errorMessage?: string;
  message?: string;
  data?: Record<string, any>;
};
export interface ICustomWorld<
  HandlerConfig = unknown,
  TestContext = DefaultTestContext & unknown
> extends World {
  context?: BrowserContext;
  page?: Page;
  handlersConfig?: HandlerConfig;
  testContext?: TestContext;
}

export class CustomWorld extends World implements ICustomWorld {
  // eslint-disable-next-line no-useless-constructor
  constructor(options: IWorldOptions) {
    super(options);
  }
}
