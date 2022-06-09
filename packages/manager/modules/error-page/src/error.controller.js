import { DEFAULT_ASSET, TRACKING_LABELS } from './error.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.DEFAULT_ASSET = DEFAULT_ASSET;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `errors::${this.getTrackingTypology()}::${this.product}`,
      type: 'navigation',
    });
  }

  getTrackingTypology() {
    if (
      this.error?.detail?.status &&
      parseInt(this.error.detail.status / 100, 10) === 4
    ) {
      return [401, 403].includes(this.error.detail.status)
        ? TRACKING_LABELS.UNAUTHORIZED
        : TRACKING_LABELS.SERVICE_NOT_FOUND;
    }
    return TRACKING_LABELS.PAGE_LOAD;
  }
}
