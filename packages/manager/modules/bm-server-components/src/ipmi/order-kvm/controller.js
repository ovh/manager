import isFunction from 'lodash/isFunction';
import set from 'lodash/set';

import { ALERT_SECTION } from '../constants';

export default class DedicatedServerOrderKvmController {
  /* @ngInject */
  constructor($translate, $window, Alerter, IpmiService) {
    this.$translate = $translate;
    this.$window = $window;
    this.IpmiService = IpmiService;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.alertSection = ALERT_SECTION;
    this.order = {};
    this.loaders = {
      details: false,
      validation: false,
    };
    this.loadOptionDetails();
  }

  loadOptionDetails() {
    this.loaders.details = true;
    return this.IpmiService.getKvmOrderDurations(this.serviceName)
      .then((durations) => {
        return this.IpmiService.getKvmOrderDetails(
          this.serviceName,
          durations,
        ).then((orderDetails) => {
          this.order.details = orderDetails.map((detail, i) => {
            set(detail, 'duration', durations[i]);
            return detail;
          });
          return this.order.details;
        });
      })
      .catch((error) => this.handleError(error, 'server_kvm_order_error'))
      .finally(() => {
        this.loaders.details = false;
      });
  }

  loadDetail() {
    this.orderDetail =
      this.order.details.filter(
        (detail) => detail.duration === this.order.durationSelected,
      )[0] || {};
  }

  orderKvm() {
    this.loaders.validation = true;
    return this.IpmiService.postKvmOrderInfos(
      this.serviceName,
      this.order.durationSelected,
    )
      .then((data) => {
        this.handleSuccess(data, 'server_kvm_order_finish_success');
        this.$window.open(data.url, '_blank', 'noopener');
        return data;
      })
      .catch((error) => this.handleError(error, 'server_kvm_order_error'))
      .finally(() => {
        this.loaders.validation = false;
      });
  }

  handleCancel() {
    if (isFunction(this.onCancel)) {
      this.onCancel();
    }
  }

  handleError(error, translationId) {
    this.Alerter.alertFromSWS(
      this.$translate.instant(translationId),
      error.data,
      this.alertSection,
    );
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  handleSuccess(data, translationId) {
    this.Alerter.alertFromSWS(
      this.$translate.instant(translationId, {
        orderUrl: data.url,
        orderId: data.orderId,
      }),
      { idTask: data.orderId, state: 'OK' },
      this.alertSection,
    );
    if (isFunction(this.onSuccess)) {
      this.onSuccess();
    }
  }
}
