angular.module('managerApp').controller('TelephonyNumberSviCtrl', function ($q, $translate, tucValidator, TucToast) {
  const self = this;
  const protocolRegexp = new RegExp(/^(http(s)?:\/\/|ftp:\/\/|mailto:)/, 'g');
  const v4UrlRegexp = new RegExp(/^(?:(?:[\w\.\-\+%!$&"\(\)*\+,;=]+:)*[\w\.\-\+%!$&"\(\)*\+,;=]+@)?(?:[a-z0-9\-\.%]+)\.[a-z]{1,5}(?::[0-9]+)?(?:[\/|\?][\w#!:\.\?\+=&%@!$"~*,;\/\(\)\[\]\-]*)?\/$/); // eslint-disable-line

  self.urlProtocols = ['http://', 'https://'];
  self.urlRecordProtocols = ['http://', 'ftp://', 'mailto:'];
  self.validator = tucValidator;

  self.model = {
    urlProtocol: null,
    urlRecordProtocol: null,
  };

  self.popoverOpen = false;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function saveFeature() {
    return self.numberCtrl.number.feature.save().then(() => {
      self.numberCtrl.jsplumbInstance.customRepaint();
      self.numberCtrl.number.feature.stopEdition();
    }).catch((error) => {
      self.numberCtrl.number.feature.stopEdition(true);
      TucToast.error([$translate.instant('telephony_number_feature_svi_save_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.numberCtrl.loading.save = false;
    });
  }

  function getProtocol(url) {
    return _.get(url.match(protocolRegexp), '[0]') || 'http://';
  }

  self.isValidURL = function (value) {
    return tucValidator.isURL(value) && tucValidator.tucIsValidDomain(value.split('/')[0]);
  };

  self.isValidUrlRecord = function (value) {
    if (!value) {
      return true;
    } if (self.model.urlRecordProtocol === 'mailto:') {
      return tucValidator.isEmail(value);
    } if (self.model.urlRecordProtocol === 'ftp://') {
      return v4UrlRegexp.test(value);
    }
    return self.isValidURL(value);
  };

  /* -----  End of HELPERS  ------*/

  /*= ==================================================
    =            GETTER SETTER FOR NG MODELS            =
    =================================================== */

  self.urlModel = function (newUrl) {
    if (arguments.length) {
      return (self.numberCtrl.number.feature.url = !_.isEmpty(newUrl) ? self.model.urlProtocol + newUrl : ''); // eslint-disable-line
    }
    return self.numberCtrl.number.feature.url.replace(protocolRegexp, '');
  };

  self.urlRecordModel = function (newUrl) {
    if (arguments.length) {
      return (self.numberCtrl.number.feature.urlRecord = !_.isEmpty(newUrl) ? self.model.urlRecordProtocol + newUrl : ''); // eslint-disable-line
    }
    return self.numberCtrl.number.feature.urlRecord.replace(protocolRegexp, '');
  };

  /* -----  End of GETTER SETTER FOR NG MODELS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  /**
   *  Called when url protocol change. Update the url value of the feature.
   */
  self.updateUrlProtocol = function () {
    const urlValue = self.numberCtrl.number.feature.url.replace(protocolRegexp, '');
    self.sviConfigForm.url.$setDirty(true);
    self.numberCtrl.number.feature.url = !_.isEmpty(urlValue) ? self.model.urlProtocol + urlValue : '';
  };

  /**
   *  Called when url record protocol change. Update the urlRecord value of the feature.
   */
  self.updateUrlRecordProtocol = function () {
    const urlValue = self.numberCtrl.number.feature.urlRecord.replace(protocolRegexp, '');
    self.sviConfigForm.urlRecord.$setDirty(true);
    self.numberCtrl.number.feature.urlRecord = !_.isEmpty(urlValue) ? self.model.urlRecordProtocol + urlValue : '';
  };

  /**
   *  Called on config button clicked.
   */
  self.togglePopover = function () {
    self.popoverOpen = !self.popoverOpen;
    if (self.popoverOpen) {
      self.numberCtrl.number.feature.startEdition();
      self.model.urlProtocol = getProtocol(self.numberCtrl.number.feature.url);
      self.model.urlRecordProtocol = getProtocol(self.numberCtrl.number.feature.urlRecord);
    } else {
      self.numberCtrl.number.feature.stopEdition(true);
    }
  };

  /**
   *  Called when submit is clicked. Configuration is OK, so we start to save the svi feature.
   */
  self.onPopoverValidate = function () {
    self.popoverOpen = false;
    return self.numberCtrl.saveNumber();
  };

  /**
   *  Called when cancel button is clicked.
   *  We stop feature configuration and rollback to previous configuration.
   */
  self.onPopoverCancel = function () {
    self.popoverOpen = false;
    self.numberCtrl.number.feature.stopEdition(true);
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   *  Component initialization
   */
  self.$onInit = function () {
    // set save feature function
    self.numberCtrl.saveFeature = saveFeature;
  };

  /**
   *  Stop feature when component is destroyed.
   */
  self.$onDestroy = function () {
    self.numberCtrl.number.feature.stopEdition(true);
  };

  /* -----  End of INITIALIZATION  ------*/
});
