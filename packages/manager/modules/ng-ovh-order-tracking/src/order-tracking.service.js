import flatten from 'lodash/flatten';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import { WAITING_PAYMENT_LABEL } from './order-tracking.constants';

export default class OrderTrackingService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getOrderDetails(order) {
    return this.$http
      .get(`/me/order/${order.orderId}/details`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then(({ data }) => data);
  }

  getOrderStatus(order) {
    return this.$http
      .get(`/me/order/${order.orderId}/status`)
      .then(({ data }) => data);
  }

  getOrderFollowUp(orderId) {
    return this.$http
      .get(`/me/order/${orderId}/followUp`)
      .then(({ data }) => data);
  }

  getCompleteHistory(order) {
    return this.getOrderFollowUp(order.orderId)
      .then((followUp) => {
        const history = reverse(
          flatten(map(followUp, (follow) => reverse(follow.history))),
        );
        if (order.status === 'notPaid' && history.length === 0) {
          history.push({
            date: order.date,
            label: WAITING_PAYMENT_LABEL,
          });
        }
        return {
          followUp,
          history,
        };
      })
      .catch((err) => {
        // 404 is returned for older orders that does not contains followUp and history
        if (err.status === 404) {
          return {
            followUp: {},
            history: [],
          };
        }
        return this.$q.reject(err);
      });
  }
}
