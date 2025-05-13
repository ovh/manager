import { IWorldOptions, World } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { ICustomWorld } from './bdd.type';

export class CustomWorld extends World implements ICustomWorld {
  page: Page = null;

  handlersConfig = {};

  testContext = { data: {} };

  // eslint-disable-next-line no-useless-constructor
  constructor(options: IWorldOptions) {
    super(options);
  }
}
