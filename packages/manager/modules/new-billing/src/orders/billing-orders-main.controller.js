import {
  FEATURE_NAME,
  LEGALFORM_NOT_ALLOWED,
} from './billing-orders-main.constant';

export default class BillingOrdersMainCtrl {
  /* @ngInject */
  constructor(
    $translate,
    currentUser,
    featuresAvailabilities,
    purchasesOrdersSectionState,
    ordersSectionState,
    guides,
    trackClick,
  ) {
    this.$translate = $translate;
    this.featuresAvailabilities = featuresAvailabilities;
    this.currentUser = currentUser;
    this.purchasesOrdersSectionState = purchasesOrdersSectionState;
    this.ordersSectionState = ordersSectionState;
    this.guides = guides;
    this.trackClick = trackClick;
  }

  $onInit() {
    if (!this.isAvailable()) {
      delete this.guides.url.my_orders.purchase_order;
    }
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
