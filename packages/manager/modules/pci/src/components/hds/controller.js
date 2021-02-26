import { HDS_INFO, SUPPORT_LEVEL_INFO } from './hds.constant';

export default class HdsComponentController {
  /* @ngInject */
  constructor(coreConfig) {
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.hdsInfoLink = this.getHdsInfoLink();
    this.supportLevelInfoLink = this.getSupportLevelInfoLink();
  }

  getHdsInfoLink() {
    return HDS_INFO[this.ovhSubsidiary] || HDS_INFO.DEFAULT;
  }

  getSupportLevelInfoLink() {
    return SUPPORT_LEVEL_INFO[this.ovhSubsidiary] || SUPPORT_LEVEL_INFO.DEFAULT;
  }

  isValidForCheckout() {
    return (
      this.hds.isValidSupportLevel &&
      this.hds.isValidForCertification &&
      !this.hds.isCertifiedProject &&
      !this.hds.isInprogressRequest
    );
  }

  onCheckboxTriggered(hdsStatus) {
    const hdsCheckbox = { status: hdsStatus };
    this.onHdsCheckboxChanged({ hdsCheckbox });
  }
}
