import map from 'lodash/map';

export default class ServerOrderTrafficService {
  /* @ngInject */
  constructor($q, $translate, Server) {
    this.$q = $q;
    this.$translate = $translate;
    this.Server = Server;
  }

  getOrderables(productId) {
    return this.Server.getOrderables(productId, 'traffic')
      .then((response) =>
        this.acceptResponse(this.transformOrderables(response.traffic)),
      )
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('server_order_traffic_loading_error'),
        ),
      );
  }

  getOrderableDurations(productId, traffic) {
    return this.Server.getOrderableDurations(productId, {
      optionName: 'traffic',
      params: {
        traffic,
      },
    })
      .then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('server_order_traffic_loading_error'),
        ),
      );
  }

  order(productId, traffic, duration) {
    return this.Server.postOptionOrder(productId, {
      optionName: 'traffic',
      duration,
      params: {
        traffic,
      },
    })
      .then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('server_order_traffic_error'),
        ),
      );
  }

  getOption(productId) {
    return this.Server.getOption(productId, 'TRAFFIC')
      .then((response) => this.acceptResponse(response))
      .catch((response) => this.rejectResponse(response.data));
  }

  cancelOption(productId) {
    return this.Server.cancelOption(productId, 'TRAFFIC')
      .then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant('server_cancel_traffic_cancel_success'),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('server_cancel_traffic_cancel_error'),
        ),
      );
  }

  transformOrderables(orderables) {
    return map(orderables, (orderable) => ({
      value: orderable,
      text: this.$translate.instant(
        `server_order_traffic_orderable_label_${orderable}`,
      ),
    }));
  }

  acceptResponse(data, message) {
    return this.$q.resolve({
      status: 'OK',
      data,
      message,
    });
  }

  rejectResponse(data, message) {
    return this.$q.reject({
      status: 'ERROR',
      data,
      message,
    });
  }
}
