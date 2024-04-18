import {
  GUIDE_PACKAGES_BASE_URL,
  GUIDE_PACKAGES_PATH,
} from '../../../general-info/constants';

export default class NutanixLicenceTileFeaturesCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.guideLink =
      (GUIDE_PACKAGES_BASE_URL[ovhSubsidiary] ||
        GUIDE_PACKAGES_BASE_URL.DEFAULT) + GUIDE_PACKAGES_PATH.PACK;
  }
}
