import has from 'lodash/has';
import indexOf from 'lodash/indexOf';

import { FEATURE_AVAILABILITY } from './constants';

export default class CucFeatureAvailabilityService {
  /* @ngInject */
  constructor($q, coreConfig) {
    this.region = coreConfig.getRegion();
    this.locale = coreConfig.getUser().ovhSubsidiary;
    this.localePromise = $q.when(this.locale);
  }

  hasFeature(product, feature, locale = this.locale) {
    if (!has(FEATURE_AVAILABILITY, [product, feature, this.region])) {
      return false;
    }
    return (
      indexOf(FEATURE_AVAILABILITY[product][feature][this.region], locale) !==
      -1
    );
  }

  hasFeaturePromise(product, feature) {
    return this.localePromise.then((locale) =>
      this.hasFeature(product, feature, locale),
    );
  }
}
