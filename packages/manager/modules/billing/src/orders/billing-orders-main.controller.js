import {
  FEATURE_NAME,
  LEGALFORM_NOT_ALLOWED,
} from './billing-orders-main.constant';

export default class BillingOrdersMainCtrl {
  /* @ngInject */
  constructor(
    $translate,
    constants,
    currentUser,
    featuresAvailabilities,
    purchasesOrdersSectionState,
    ordersSectionState,
  ) {
    this.$translate = $translate;
    this.featuresAvailabilities = featuresAvailabilities;
    this.constants = constants;
    this.currentUser = currentUser;
    this.purchasesOrdersSectionState = purchasesOrdersSectionState;
    this.ordersSectionState = ordersSectionState;
  }

  $onInit() {
    const CUSTOMER_URLS =
      this.constants.urls[this.currentUser.ovhSubsidiary] ||
      this.constants.urls.FR;

    this.billingGuideUrl = CUSTOMER_URLS.guides.billing;
    this.purchaseOrdersGuideUrl = CUSTOMER_URLS.guides.purchaseOrders;
  }

  isAvailable() {
    return (
      this.featuresAvailabilities[FEATURE_NAME] &&
      this.currentUser.legalform !== LEGALFORM_NOT_ALLOWED
    );
  }

  titleheading() {
    return this.isAvailable()
      ? this.$translate.instant('orders_page_title')
      : '';
  }
}
