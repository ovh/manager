import { TRACKING_CONTEXT } from './constants';

export default class RbxEolBannerController {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.TRACKING_CONTEXT = TRACKING_CONTEXT;
  }

  $onInit() {
    this.atInternet.trackPage({
      ...this.TRACKING_CONTEXT,
    });
  }
}
