import { LOCAL_ZONE_DOCUMENTATION } from './constants';

export default class PCIFreeLocalZonesBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    const { ovhSubsidiary } = coreConfig.getUser();
    this.localZoneDocumentation =
      LOCAL_ZONE_DOCUMENTATION[ovhSubsidiary] ||
      LOCAL_ZONE_DOCUMENTATION.DEFAULT;
  }
}
