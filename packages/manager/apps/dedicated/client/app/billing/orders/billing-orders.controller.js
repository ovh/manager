import assign from 'lodash/assign';
import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class BillingOrdersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $log,
    $translate,
    OvhApiMeOrder,
    constants,
    orders,
    schema,
    criteria,
    currentUser,
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
    this.criteria = criteria || [];
    this.filter = filter;
    this.getOrderTrackingHref = getOrderTrackingHref;
    this.goToOrder = goToOrder;
    this.goToOrderRetractation = goToOrderRetractation;
    this.updateFilterParam = updateFilterParam;
    this.billingGuideUrl = get(
      constants.urls[currentUser.ovhSubsidiary],
      'guides.billing',
    );
    this.allowOrderTracking = billingFeatureAvailability.allowOrderTracking();
  }

  loadRow($row) {
    return this.OvhApiMeOrder.v6()
      .getStatus({ orderId: $row.orderId })
      .$promise.then((status) => assign($row, status))
      .then(() =>
        assign($row, {
          canRetract: moment($row.retractionDate || 0).isAfter(this.timeNow),
        }),
      );
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
