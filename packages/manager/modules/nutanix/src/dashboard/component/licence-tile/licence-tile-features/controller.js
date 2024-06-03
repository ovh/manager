import { GUIDES_URL } from '../../../general-info/constants';

export default class NutanixLicenceTileFeaturesCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.guideLink = GUIDES_URL[ovhSubsidiary] || GUIDES_URL.DEFAULT;
  }
}
