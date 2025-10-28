import get from 'lodash/get';
import set from 'lodash/set';
import omit from 'lodash/omit';
import { BILLING_ORDERS_STATUS } from './billing-orders.constant';

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
    timeNow,
    kycValidated,
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
    this.timeNow = timeNow;
    this.kycValidated = kycValidated;
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('orders_page_description')
      : '';
  }

  loadRow($row) {
    return this.OvhApiMeOrder.v6()
      .getStatus({ orderId: $row.orderId })
      .$promise.then((statusResponse) => {
        const order = {
          ...$row,
          canRetract: moment($row.retractionDate || 0).isAfter(this.timeNow),
        };
        let { status } = statusResponse;
        const isExpired = moment(order.expirationDate).isBefore(this.timeNow);

        if (status === BILLING_ORDERS_STATUS.NOT_PAID) {
          if (isExpired) {
            status = BILLING_ORDERS_STATUS.ORDER_EXPIRED;
          } else if (!this.kycValidated) {
            status = BILLING_ORDERS_STATUS.DOCUMENTS_REQUESTED;
          }
        }
        order.status = status;
        return order;
      });
  }

  getStateEnumFilter() {
    const states = get(this.schema.models, 'billing.order.OrderStatusEnum')
      .enum;

    states.push(BILLING_ORDERS_STATUS.ORDER_EXPIRED);

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
