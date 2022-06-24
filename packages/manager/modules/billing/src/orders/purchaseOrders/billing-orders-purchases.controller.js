import omit from 'lodash/omit';
import set from 'lodash/set';

import {
  ENUM_PURCHASES_STATUS,
  TYPE_PURCHASE_FOR_TRACKING,
  PAGE_SIZE,
} from './billing-orders-purchases.constant';

export default class BillingOrdersPurchasesCtrl {
  /* @ngInject */
  constructor($log, $translate, billingOrdersPurchasesService) {
    this.$log = $log;
    this.$translate = $translate;
    this.billingOrdersPurchasesService = billingOrdersPurchasesService;
    this.ENUM_PURCHASES_STATUS = ENUM_PURCHASES_STATUS;
    this.PAGE_SIZE = PAGE_SIZE;
  }

  editPurchase(purchase) {
    return this.goToEditPurchase(purchase);
  }

  editPurchaseStatus(purchase) {
    const action = purchase.active
      ? 'goToModalDesactivatePurchase'
      : 'purchaseReActivation';
    return this[action](purchase);
  }

  getStateEnumFilter() {
    const states = this.ENUM_PURCHASES_STATUS;
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
    return this.goToNewPurchase();
  }

  onCriteriaChange(criteria) {
    this.criteria = criteria;
    try {
      this.filter = encodeURIComponent(
        JSON.stringify(criteria.map((c) => omit(c, 'title'))),
      );
      return this.updateFilterParam(this.filter);
    } catch (err) {
      return this.$log.error(err);
    }
  }

  purchaseReActivation(purchase) {
    this.trackPage(`reactivate-${TYPE_PURCHASE_FOR_TRACKING[purchase.type]}`);

    const data = {
      active: true,
    };

    return this.billingOrdersPurchasesService
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
