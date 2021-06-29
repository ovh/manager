import has from 'lodash/has';
import indexOf from 'lodash/indexOf';

import { FEATURE_AVAILABILITY } from './constants';

export default class CucFeatureAvailabilityService {
  /* @ngInject */
  constructor($q, coreConfig, CucConfig) {
    this.CucConfig = CucConfig;

    this.locale = coreConfig.getUser().ovhSubsidiary;
    this.localePromise = $q.when(this.locale);
  }

  hasFeature(product, feature, locale = this.locale) {
    if (
      !has(FEATURE_AVAILABILITY, [product, feature, this.CucConfig.getRegion()])
    ) {
      return false;
    }
    return (
      indexOf(
        FEATURE_AVAILABILITY[product][feature][this.CucConfig.getRegion()],
        locale,
      ) !== -1
    );
  }

  hasFeaturePromise(product, feature) {
    return this.localePromise.then((locale) =>
      this.hasFeature(product, feature, locale),
    );
  }
}
