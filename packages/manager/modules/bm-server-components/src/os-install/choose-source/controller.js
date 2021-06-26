import isFunction from 'lodash/isFunction';

import {
  BYOI_FEATURE,
  INSTALL_TYPES,
} from './constants';

export default class BmServerComponentsOsInstallChooseSourceController {
  /* @ngInject */
  constructor($http, ovhFeatureFlipping, atInternet) {
    this.$http = $http;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.INSTALL_TYPES = INSTALL_TYPES;
    this.installType = INSTALL_TYPES.OVH;
    this.isByoiAvailable = false;
    this.loading = true;
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(BYOI_FEATURE)
      .then((byoiFeatureResult) => {
        this.isByoiAvailable = byoiFeatureResult.isFeatureAvailable(
          BYOI_FEATURE,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onSubmit() {
    switch(this.installType) {
      case INSTALL_TYPES.OVH:
        this.trackPage(
          'dedicated::dedicated::server::system-install::public-catalog',
        );
      case INSTALL_TYPES.PERSONAL:
        this.trackPage(
          'dedicated::dedicated::server::system-install::existing-template',
        );
      case INSTALL_TYPES.IMAGE:
        this.trackPage(
          'dedicated::dedicated::server::system-install::personalized-image',
        );
    }
    if (isFunction(this.onSelect)) {
      this.onSelect({ installFrom: this.installType });
    }
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name,
      type: 'navigation',
    });
  };

  goBack() {
    if (isFunction(this.onGoBack)) {
      this.onGoBack();
    }
  }
}
