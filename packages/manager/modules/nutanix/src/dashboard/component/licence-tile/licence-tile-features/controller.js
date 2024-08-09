import {
  GUIDES_URL,
  NUTANIX_PERSONAL_LICENSE_EDITION,
} from '../../../general-info/constants';

export default class NutanixLicenceTileFeaturesCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.guideLink =
      (GUIDES_URL[ovhSubsidiary] || GUIDES_URL.DEFAULT) +
      (this.packType === NUTANIX_PERSONAL_LICENSE_EDITION
        ? 'byol'
        : 'packaged');
  }
}
