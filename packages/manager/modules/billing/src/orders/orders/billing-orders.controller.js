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
    this.BADGES_CLASS = BADGES_CLASS;
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
      .$promise.then(({ status }) => {
        // TODO: This code should be removed when API is ready (MANAGER-16109)
        // As the API does not differentiate not paid and not finalized orders, we are handle it on front side
        // As to impact as little as possible our current behavior we restrict the adaptation to Indian customer
        // with order not paid and not expired
        const isNeedingAdaptation =
          user.ovhSubsidiary === 'IN' &&
          status === 'notPaid' &&
          moment($row.expirationDate || 0).isAfter(this.timeNow);
        let formattedStatus = status;
        if (isNeedingAdaptation) {
          // We override the api order's status with 'toFinalize' if the KYC procedure is done, 'documentsRequested' otherwise
          formattedStatus = user.kycValidated
            ? 'toFinalize'
            : 'documentsRequested';
        }
        return {
          ...$row,
          canRetract: moment($row.retractionDate || 0).isAfter(this.timeNow),
          status: formattedStatus,
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
