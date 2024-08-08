import isFunction from 'lodash/isFunction';
import { getKvmOrderTrackingPrefix, KVM_PLAN_CODE } from '../constants';

export default class BmServerComponentsOrderKvmController {
  /* @ngInject */
  constructor($translate, $window, IpmiService, atInternet, coreConfig) {
    this.$translate = $translate;
    this.$window = $window;
    this.IpmiService = IpmiService;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.serviceName = this.server.name;
    const [datacenter] = this.server.datacenter.split('_');
    this.datacenter = datacenter.toLowerCase();
    this.contractAgreement = false;
    this.pendingOrder = false;
    this.region = this.coreConfig.getRegion();
    this.prepareKvmCart();
  }

  prepareKvmCart() {
    // In US, If the server is managed by EU IS: you have to order usb-kvm-ip-eu and
    // if the server is managed by CA IS: you have to order usb-kvm-ip-ca
    // For EU and CA its usb-kvm-ip
    if (this.region === 'US') {
      this.kvmPlancode = this.server.region.startsWith('eu-')
        ? KVM_PLAN_CODE.US.EU
        : KVM_PLAN_CODE.US.CA;
    } else {
      this.kvmPlancode = KVM_PLAN_CODE.OTHERS;
    }
    this.loading = true;
    this.IpmiService.prepareKvmCart(
      this.serviceName,
      this.datacenter,
      this.kvmPlancode,
    )
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
      name: `${getKvmOrderTrackingPrefix(this.serverType)}-${bannerType}`,
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
      name: `${getKvmOrderTrackingPrefix(this.serverType)}::confirm`,
      type: 'action',
    });
    this.IpmiService.orderKvm(this.cartId)
      .then(({ url, orderId }) => {
        this.handleSuccess(
          this.$translate.instant(
            'server_configuration_kvm_order_finish_success',
            {
              url,
              orderId,
            },
          ),
        );
        this.$window.open(url, '_blank', 'noopener');
        this.orderId = orderId;
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
