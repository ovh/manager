import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';
import { BADGES_CLASS } from './orders.constants';

export default class BillingOrdersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $log,
    $translate,
    OvhApiMeOrder,
    coreConfig,
    orders,
    schema,
    criteria,
    filter,
    getOrderTrackingHref,
    goToOrder,
    goToOrderRetractation,
    updateFilterParam,
    billingFeatureAvailability,
  ) {
    this.$q = $q;
    this.$log = $log;
    this.$translate = $translate;
    this.OvhApiMeOrder = OvhApiMeOrder;
    this.orders = orders;
    this.schema = schema;
    this.coreConfig = coreConfig;
    this.criteria = criteria || [];
    this.filter = filter;
    this.getOrderTrackingHref = getOrderTrackingHref;
    this.goToOrder = goToOrder;
    this.goToOrderRetractation = goToOrderRetractation;
    this.updateFilterParam = updateFilterParam;
    this.allowOrderTracking = billingFeatureAvailability.allowOrderTracking();
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('orders_page_description')
      : '';
  }

  loadRow($row) {
    const user = this.coreConfig.getUser();
    return this.OvhApiMeOrder.v6()
      .getStatus({ orderId: $row.orderId })
      .$promise.then(({ status: apiStatus }) => {
        // This code should be removed when API is ready (MANAGER-16109)
        // As the API does not differentiate not paid and not finalized orders, we are handle it on front side
        // As to impact as little as possible our current behavior we restrict the adaptation to Indian customer
        // with order not paid and not expired
        const isNeedingAdaptation =
          user.ovhSubsidiary === 'IN' &&
          apiStatus === 'notPaid' &&
          moment($row.expirationDate || 0).isAfter(this.timeNow);
        const status = {
          badgeClass: BADGES_CLASS[apiStatus],
          translationKey: `orders_order_status_${apiStatus}`,
        };
        if (isNeedingAdaptation) {
          // If the customer has not yet finished his KYC, we will display a warning badge stating we are waiting for
          // documents, otherwise we'll display an informative badge stating the order is waiting to be finalized
          status.badgeClass = user.kycValidated ? 'info' : 'warning';
          status.translationKey = user.kycValidated
            ? 'orders_order_status_toFinalize'
            : 'orders_order_status_documentsRequested';
        }
        return {
          ...$row,
          canRetract: moment($row.retractionDate || 0).isAfter(this.timeNow),
          status,
          canFinalize: isNeedingAdaptation && user.kycValidated,
        };
      });
  }

  getStateEnumFilter() {
    const states = get(this.schema.models, 'billing.order.OrderStatusEnum')
      .enum;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      set(
        filter.values,
        state,
        this.$translate.instant(`orders_order_status_${state}`),
      );
    });

    return filter;
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
}
