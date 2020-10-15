import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';

export default class TelecomTelephonyLinePhoneAccessoriesResumeCtrl {
  /* @ngInject */
  constructor($q, atInternet, TucTelephonyAccessoriesOrderProcess) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.TucTelephonyAccessoriesOrderProcess = TucTelephonyAccessoriesOrderProcess;
  }

  $onInit() {
    this.process = null;
    this.order = null;
    this.error = null;
    this.model = {
      contracts: false,
      retract: null,
    };
    this.loading = {
      init: false,
    };

    this.loading.init = true;
    this.process = this.TucTelephonyAccessoriesOrderProcess.getOrderProcess();

    return this.TucTelephonyAccessoriesOrderProcess.getOrderCheckout()
      .then((order) => {
        remove(
          order.details,
          (detail) =>
            ['SPECIAL', 'MUTE'].includes(detail.detailType) ||
            (isEqual(detail.detailType, 'DELIVERY') &&
              detail.totalPrice.value === 0),
        );

        this.order = order;
      })
      .catch((error) => {
        this.error = error;
        return this.$q.reject(error);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  submit() {
    this.track(
      'telecom::telephony::billingAccount::line::phone::accessories::summary::validate',
    );
    this.atInternet.trackPage({
      name:
        'telecom::telephony::billingAccount::line::phone::accessories::summary',
    });
    this.process.currentView = 'finalize';
  }

  goBack() {
    this.track(
      'telecom::telephony::billingAccount::line::phone::accessories::summary::previous',
    );
    this.process.currentView = 'shipping';
  }

  track(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
