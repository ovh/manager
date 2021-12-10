import get from 'lodash/get';

export default class BillingOrdersMainCtrl {
  /* @ngInject */
  constructor(constants, currentUser, coreConfig) {
    this.coreConfig = coreConfig;
    this.billingGuideUrl = get(
      constants.urls[currentUser.ovhSubsidiary],
      'guides.billing',
    );
    this.purchaseOrdersGuideUrl = get(
      constants.urls[currentUser.ovhSubsidiary],
      'guides.purchaseOrders',
    );
  }
}
