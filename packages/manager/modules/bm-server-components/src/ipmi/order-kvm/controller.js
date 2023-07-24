import isFunction from 'lodash/isFunction';
import { KVM_ORDER_TRACKING_PREFIX } from '../constants';

export default class BmServerComponentsOrderKvmController {
  /* @ngInject */
  constructor($translate, $window, IpmiService, atInternet) {
    this.$translate = $translate;
    this.$window = $window;
    this.IpmiService = IpmiService;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.serviceName = this.server.name;
    const [datacenter] = this.server.datacenter.split('_');
    this.datacenter = datacenter.toLowerCase();
    this.contractAgreement = false;
    this.pendingOrder = false;
    this.prepareKvmCart();
  }

  prepareKvmCart() {
    this.loading = true;
    this.IpmiService.prepareKvmCart(this.serviceName, this.datacenter)
      .then(
        ({
          cartId,
          contracts,
          prices: {
            withTax: { text },
          },
        }) => {
          this.cartId = cartId;
          this.contracts = contracts;
          this.contractAgreement = contracts?.length === 0;
          this.kvmPrice = text;
        },
      )
      .catch((error) => this.displayKvmOrderError(error))
      .finally(() => {
        this.loading = false;
      });
  }

  trackBanner(bannerType) {
    this.atInternet.trackPage({
      name: `${KVM_ORDER_TRACKING_PREFIX}-${bannerType}`,
    });
  }

  displayKvmOrderError(error) {
    this.contractAgreement = false;
    return this.handleError(
      error,
      this.$translate.instant('server_configuration_kvm_order_error'),
    );
  }

  orderKvm() {
    this.pendingOrder = true;
    this.atInternet.trackClick({
      name: `${KVM_ORDER_TRACKING_PREFIX}-confirm`,
      type: 'action',
    });
    this.IpmiService.orderKvm(this.cartId)
      .then(({ url, orderId }) => {
        this.handleSuccess(
          this.$translate.instant(
            'server_configuration_kvm_order_finish_success',
          ),
        );
        this.$window.open(url, '_blank', 'noopener');
        this.goBack(orderId);
      })
      .catch((error) => this.displayKvmOrderError(error))
      .finally(() => {
        this.pendingOrder = false;
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
    this.trackBanner('error');
    if (isFunction(this.onError)) {
      this.onError({
        error: { message, data: error },
      });
    }
  }

  handleSuccess(message) {
    this.trackBanner('success');
    if (isFunction(this.onSuccess)) {
      this.onSuccess({
        message,
      });
    }
  }
}
