import { IWorldOptions, World } from '@cucumber/cucumber';
import { ICustomWorld } from './bdd.type';

export class CustomWorld extends World implements ICustomWorld {
  // eslint-disable-next-line no-useless-constructor
  constructor(options: IWorldOptions) {
    super(options);
  }
}
