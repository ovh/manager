import { Environment } from '@ovh-ux/manager-config';

export default class CoreConfig {
  constructor() {
    this.region = Environment.getRegion();
  }

  getRegion() {
    return this.region;
  }

  $get() {
    return {
      getRegion: () => this.region,
    };
  }
}
