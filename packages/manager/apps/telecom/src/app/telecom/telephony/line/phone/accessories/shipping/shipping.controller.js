import forEach from 'lodash/forEach';

import filterContact from './shipping.service';

export default class TelecomTelephonyLinePhoneAccessoriesShippingCtrl {
  /* @ngInject */
  constructor($q, atInternet, TucTelephonyAccessoriesOrderProcess) {
    this.$q = $q;
    this.atInternet = atInternet;
    this.TucTelephonyAccessoriesOrderProcess = TucTelephonyAccessoriesOrderProcess;
  }

  $onInit() {
    this.process = null;
    this.loading = {
      init: false,
    };
    this.shippingOptions = {
      forceContactSelect: true,
      payForRelay: true,
    };
    this.contactDeferred = this.$q.defer();

    this.loading.init = true;
    this.process = this.TucTelephonyAccessoriesOrderProcess.getOrderProcess();

    // shipping mode selection options
    this.shippingOptions.disableMondialRelay =
      this.getTotalAccessoriesQuantity() > 1;
    this.contactChoiceOptions = {
      filter: filterContact,
    };

    this.loading.init = false;
  }

  getTotalAccessoriesQuantity() {
    let totalQty = 0;
    forEach(this.process.accessoriesList, (accessory) => {
      totalQty += accessory.quantity;
    });
    return totalQty;
  }

  /* -----  End of HELPERS  ------*/

  /* ================================
     =            ACTIONS           =
     ================================ */
  onShippingModeInitialized() {
    this.loading.init = false;
  }

  submit() {
    this.track(
      'telecom::telephony::billingAccount::line::phone::accessories::delivery::next',
    );
    this.process.currentView = 'resume';
  }

  goBack() {
    this.track(
      'telecom::telephony::billingAccount::line::phone::accessories::delivery::previous',
    );
    this.process.currentView = 'choice';
  }

  track(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
