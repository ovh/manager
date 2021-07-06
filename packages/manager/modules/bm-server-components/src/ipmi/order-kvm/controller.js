import isFunction from 'lodash/isFunction';
import set from 'lodash/set';

export default class BmServerComponentsOrderKvmController {
  /* @ngInject */
  constructor($translate, $window, IpmiService) {
    this.$translate = $translate;
    this.$window = $window;
    this.IpmiService = IpmiService;
  }

  $onInit() {
    this.serviceName = this.server.name;
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
      .catch((error) => this.handleError(
        error,
        this.$translate.instant(
          'server_configuration_kvm_order_error',
        ),
      ))
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
        this.handleSuccess(
          this.$translate.instant(
            'server_configuration_kvm_order_finish_success',
            {
              orderUrl: data.url,
              orderId: data.orderId,
            }
          ),
        );
        this.$window.open(data.url, '_blank', 'noopener');
        return data;
      })
      .catch((error) => this.handleError(
        error,
        this.$translate.instant(
          'server_configuration_kvm_order_error',
        ),
      ))
      .finally(() => {
        this.loaders.validation = false;
      });
  }

  handleCancel() {
    if (isFunction(this.onCancel)) {
      this.onCancel();
    }
  }

  goBack() {
    if (isFunction(this.onGoBack)) {
      this.onGoBack();
    }
  }

  handleError(error, message = null) {
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error }
      });
    }
  }

  handleSuccess(message) {
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message
      });
    }
  }
}
