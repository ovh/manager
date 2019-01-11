angular.module('managerApp').controller('TelecomTelephonyLineManagementOfferChangeEditCtrl', function ($timeout, $uibModalInstance, $translate, currentLine) {
  const self = this;

  self.line = null;
  self.availableOffers = null;

  self.loading = {
    init: false,
    save: false,
  };

  self.model = {
    offer: null,
  };

  self.status = {
    saved: false,
  };

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.cancel = function (message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function () {
    return $uibModalInstance.close(true);
  };

  self.saveNewOffer = function () {
    self.loading.save = true;

    return self.line.changeOffer(self.model.offer).then(() => {
      self.status.saved = true;

      return $timeout(self.close, 1000);
    }, error => self.cancel(angular.extend(error, {
      type: 'API',
    }))).finally(() => {
      self.loading.save = false;
    });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;
    self.line = currentLine;

    return self.line.getAvailableOffers().then((offers) => {
      self.availableOffers = offers;

      // this is not sexy but we don't have information about the offer name for the moment
      self.model.offer = _.find(self.availableOffers, {
        type: self.line.offerInformations.type,
        description: self.line.offerInformations.description,
      });
    }, error => self.cancel(angular.extend(error, {
      type: 'API',
      init: true,
    }))).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
