import defaults from 'lodash/defaults';

export default function () {
  const self = this;
  const allowedModes = ['mondialRelay', 'transporter'];

  self.loading = {
    init: false,
    contact: false,
  };

  self.contactFullList = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function checkOptions() {
    self.options = defaults(self.options || {}, {
      forceContactSelect: false,
      payForRelay: false,
      disableMondialRelay: false,
      disableTransporter: false,
      shippingPrice: 9.99,
    });

    if (self.options.disableMondialRelay && self.options.disableTransporter) {
      throw new Error(
        'shippingModeSelection component : you cannot disable mondialRelay AND transporter modes !',
      );
    }

    if (!self.selectedMode) {
      self.selectedMode = self.options.disableMondialRelay
        ? 'transporter'
        : 'mondialRelay';
    } else if (allowedModes.indexOf(self.selectedMode) === -1) {
      throw new Error(
        `shippingModeSelection component : ${self.selectedMode} is not an allowed value for shippingModeSelectionMode parameter.`,
      );
    }
  }

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.resetValues = function resetValues() {
    if (
      self.selectedMode === 'mondialRelay' &&
      !self.options.forceContactSelect
    ) {
      self.shippingContact = null;
    } else if (self.selectedMode === 'transporter') {
      self.selectedRelay = null;
    }
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    checkOptions();

    if (self.onInitialized) {
      self.onInitialized().finally(() => {
        self.loading.init = false;
      });
    } else {
      self.loading.init = false;
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
