import { IWorldOptions, World } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export interface ICustomWorld extends World {
  context?: BrowserContext;
  page?: Page;
}

export class CustomWorld extends World implements ICustomWorld {
  // eslint-disable-next-line no-useless-constructor
  constructor(options: IWorldOptions) {
    super(options);
  }
}
