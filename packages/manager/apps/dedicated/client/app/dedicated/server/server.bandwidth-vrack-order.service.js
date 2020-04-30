/* eslint-disable max-classes-per-file */
import map from 'lodash/map';

class BaseDedicatedService {
  constructor($q) {
    this.$q = $q;
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

export default class BandwidthVrackOrderService extends BaseDedicatedService {
  /* @ngInject */
  constructor($q, $translate, Server) {
    super($q);
    this.$translate = $translate;
    this.Server = Server;
  }

  getOrderableBandwidths(productId) {
    return this.Server.getOrderables(productId, 'bandwidthvRack')
      .then((response) =>
        super.acceptResponse(this.transformOrderableBandwidths(response.vrack)),
      )
      .catch((response) =>
        super.rejectResponse(
          response.data,
          this.$translate.instant('server_order_bandwidth_vrack_loading_error'),
        ),
      );
  }

  getOrderableBandwidthDurations(productId, bandwidth) {
    return this.Server.getOrderableDurations(productId, {
      optionName: 'bandwidthvRack',
      params: {
        bandwidth,
      },
    })
      .then((response) => super.acceptResponse(response))
      .catch((response) =>
        super.rejectResponse(
          response.data,
          this.$translate.instant('server_order_bandwidth_vrack_loading_error'),
        ),
      );
  }

  orderBandWidth(productId, bandwidth, duration) {
    return this.Server.postOptionOrder(productId, {
      optionName: 'bandwidthvRack',
      duration,
      params: {
        bandwidth,
      },
    })
      .then((response) => super.acceptResponse(response))
      .catch((response) =>
        super.rejectResponse(
          response.data,
          this.$translate.instant('server_order_bandwidth_vrack_error'),
        ),
      );
  }

  cancelBandwidthOption(productId) {
    return this.Server.cancelOption(productId, 'BANDWIDTH_VRACK')
      .then((response) =>
        super.acceptResponse(
          response,
          this.$translate.instant(
            'server_cancel_bandwidth_vrack_cancel_success',
          ),
        ),
      )
      .catch((response) =>
        super.rejectResponse(
          response.data,
          this.$translate.instant('server_cancel_bandwidth_cancel_vrack_error'),
        ),
      );
  }

  transformOrderableBandwidths(bandwidths) {
    return map(bandwidths, (bandwidth) => ({
      value: bandwidth,
      unit: 'mbps',
      text: this.$translate.instant('unit_gbps', {
        t0: Math.floor(bandwidth / 1000),
      }),
    }));
  }
}
/* eslint-enable max-classes-per-file */
