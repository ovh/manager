import { EOL_LV1_LV2_SERVICES_LINK_INFO } from './constants';

export default class EolLv1Lv2ServicesBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.eolLv1Lv2ServicesInfoLink =
      EOL_LV1_LV2_SERVICES_LINK_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      EOL_LV1_LV2_SERVICES_LINK_INFO.DEFAULT;
  }
}
