import { ACTIVATION_STATUS } from './activationStatus/activationStatus.constants';
import { ORDER_STATUS } from './options.constants';

export const name = 'ovhManagerPccDashboardOptions';

export const OvhManagerPccDashboardOptions = class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiMe,
    ovhManagerPccDashboardOptionsPreference,
  ) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
    this.ovhManagerPccDashboardOptionsPreference = ovhManagerPccDashboardOptionsPreference;
  }

  doesPendingOrderExists(serviceName) {
    const fetchPendingOrderIfPreferenceExists = preferenceExists => (preferenceExists
      ? this.fetchPendingOrder(serviceName)
      : this.$q.reject({ status: 404 }));

    const treat404AsNotFound = error => (error.status === 404
      ? false
      : error);

    return this.ovhManagerPccDashboardOptionsPreference
      .doesPreferenceExists(serviceName)
      .then(fetchPendingOrderIfPreferenceExists)
      .then(() => true)
      .catch(treat404AsNotFound);
  }

  fetchOrder(orderId) {
    const mergeArray = array => array
      .reduce((accumulator, current) => ({ ...accumulator, ...current }), {});

    return this.$q
      .all([
        this.OvhApiMe.Order().v6().get({ orderId }).$promise,
        this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise,
      ])
      .then(mergeArray);
  }

  static mapOrderStatusToActivationStatus(orderStatus, isAdding) {
    if ([
      ORDER_STATUS.documentsRequested,
      ORDER_STATUS.notPaid,
    ].includes(orderStatus)) {
      return ACTIVATION_STATUS.pendingActivation;
    }

    if ([
      ORDER_STATUS.cancelling,
    ].includes(orderStatus)) {
      return ACTIVATION_STATUS.cancelling;
    }

    if ([
      ORDER_STATUS.checking,
      ORDER_STATUS.delivering,
    ].includes(orderStatus)) {
      return isAdding
        ? ACTIVATION_STATUS.beingActivated
        : ACTIVATION_STATUS.beingDeactivated;
    }

    if ([
      ORDER_STATUS.delivered,
    ].includes(orderStatus)) {
      return ACTIVATION_STATUS.enabled;
    }

    return ACTIVATION_STATUS.unknown;
  }
};

export default {
  name,
  OvhManagerPccDashboardOptions,
};
