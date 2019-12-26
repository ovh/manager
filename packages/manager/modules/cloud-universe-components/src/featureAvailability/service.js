import has from 'lodash/has';
import indexOf from 'lodash/indexOf';

import { FEATURE_AVAILABILITY } from './constants';

export default class CucFeatureAvailabilityService {
  /* @ngInject */
  constructor(OvhApiMe, CucConfig) {
    this.User = OvhApiMe;
    this.CucConfig = CucConfig;

    this.locale = null;
    this.localePromise = this.User.v6()
      .get()
      .$promise.then((user) => {
        this.locale = user.ovhSubsidiary;
        return user.ovhSubsidiary;
      });
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
