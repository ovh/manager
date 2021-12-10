export default class BillingOrdersMainCtrl {
  /* @ngInject */
  constructor(
    constants,
    currentUser,
    featuresAvailabilities,
    purchasesOrdersSectionState,
    ordersSectionState,
  ) {
    this.featuresAvailabilities = featuresAvailabilities;
    this.constants = constants;
    this.currentUser = currentUser;
    this.purchasesOrdersSectionState = purchasesOrdersSectionState;
    this.ordersSectionState = ordersSectionState;
  }

  $onInit() {
    const CUSTOMER_URLS = this.constants.urls[this.currentUser.ovhSubsidiary];

    this.billingGuideUrl = CUSTOMER_URLS.guides.billing;
    this.purchaseOrdersGuideUrl = CUSTOMER_URLS.guides.purchaseOrders;
  }
}
