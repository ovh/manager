import { BILLING_CHANGE_MEDIATION_LINKS } from './constants';

export default class ProjectBillingChangeMediationController {
  /* @ngInject */
  constructor(coreConfig) {
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.billingChangeMediationLink =
      BILLING_CHANGE_MEDIATION_LINKS[this.ovhSubsidiary] ||
      BILLING_CHANGE_MEDIATION_LINKS.DEFAULT;
  }
}
