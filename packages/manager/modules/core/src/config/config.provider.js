import { Environment } from '@ovh-ux/manager-config';

export default class CoreConfig {
  constructor() {
    this.region = Environment.getRegion();
  }

  getRegion() {
    return this.region;
  }

  isRegion(region) {
    const regions = Array.isArray(region) ? region : [region];
    return regions.indexOf(this.region) >= 0;
  }

  $get() {
    return {
      getRegion: () => this.getRegion(),
      isRegion: (region) => this.isRegion(region),
    };
  }
}
