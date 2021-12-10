import omit from 'lodash/omit';
import set from 'lodash/set';

import {
  ENUM_PURCHASES_STATUS,
  TYPE_PURCHASE_FOR_TRACKING,
} from './billing-orders-purchases.constant';

export default class BillingOrdersPurchasesCtrl {
  /* @ngInject */
  constructor($log, $translate, billingOrdersPurchasesService) {
    this.$log = $log;
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
  }

  $onInit() {
    this.trackPage('orders-internal-ref');
  }

  editPurchase(purchase) {
    this.goToEditPurchase(purchase);
  }

  editPurchaseStatus(purchase) {
    if (purchase.active === true) {
      this.goToModalDesactivatePurchase(purchase);
    } else {
      this.purchaseReActivation(purchase);
    }
  }

  getStateEnumFilter() {
    const states = ENUM_PURCHASES_STATUS;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`purchaseOrders_status_${state}`),
      );
    });

    return filter;
  }

  newPurchase() {
    this.trackClick('create-internal-ref');
    this.goToNewPurchase();
  }

  onCriteriaChange(criteria) {
    this.criteria = criteria;
    try {
      this.filter = encodeURIComponent(
        JSON.stringify(criteria.map((c) => omit(c, 'title'))),
      );
      this.updateFilterParam(this.filter);
    } catch (err) {
      this.$log.error(err);
    }
  }

  purchaseReActivation(purchase) {
    this.trackPage(`reactivate-${TYPE_PURCHASE_FOR_TRACKING[purchase.type]}`);

    const data = {
      active: true,
    };

    this.billingOrdersPurchasesService
      .putPurchaseOrder(purchase.id, data)
      .then(() => {
        this.trackPage(
          `reactivate-${TYPE_PURCHASE_FOR_TRACKING[purchase.type]}_success`,
        );

        this.goToPurchaseOrder(
          this.$translate.instant(
            `purchaseOrders_confirmation_reactivation_${purchase.type}_success`,
          ),
          'success',
        );
      })
      .catch(() => {
        this.trackPage(
          `reactivate-${TYPE_PURCHASE_FOR_TRACKING[purchase.type]}_error`,
        );

        this.goToPurchaseOrder(
          this.$translate.instant(
            'purchaseOrders_confirmation_reactivation_error',
          ),
          'danger',
        );
      });
  }
}
