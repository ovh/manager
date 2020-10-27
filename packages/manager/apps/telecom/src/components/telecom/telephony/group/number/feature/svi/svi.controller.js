import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function TelephonyNumberSviCtrl(
  $q,
  $translate,
  tucValidator,
  TucToast,
) {
  const self = this;
  const protocolRegexp = new RegExp(/^(http(s)?:\/\/|ftp:\/\/|mailto:)/, 'g');
  const v4UrlRegexp = new RegExp(
    /^(?:(?:[\w.\-+%!$&"()*+,;=]+:)*[\w.\-+%!$&"()*+,;=]+@)?(?:[a-z0-9\-.%]+)\.[a-z]{1,5}(?::[0-9]+)?(?:[/|?][\w#!:.?+=&%@!$"~*,;/()[\]-]*)?\/$/,
  );

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
    return self.numberCtrl.number.feature
      .save()
      .then(() => {
        self.numberCtrl.jsplumbInstance.customRepaint();
        self.numberCtrl.number.feature.stopEdition();
      })
      .catch((error) => {
        self.numberCtrl.number.feature.stopEdition(true);
        TucToast.error(
          [
            $translate.instant('telephony_number_feature_svi_save_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.numberCtrl.loading.save = false;
      });
  }

  function getProtocol(url) {
    return get(url.match(protocolRegexp), '[0]') || 'http://';
  }

  self.isValidURL = function isValidURL(value) {
    return (
      tucValidator.isURL(value) &&
      tucValidator.tucIsValidDomain(value.split('/')[0])
    );
  };

  self.isValidUrlRecord = function isValidUrlRecord(value) {
    if (!value) {
      return true;
    }
    if (self.model.urlRecordProtocol === 'mailto:') {
      return tucValidator.isEmail(value);
    }
    if (self.model.urlRecordProtocol === 'ftp://') {
      return v4UrlRegexp.test(value);
    }
    return self.isValidURL(value);
  };

  /* -----  End of HELPERS  ------*/

  /*= ==================================================
    =            GETTER SETTER FOR NG MODELS            =
    =================================================== */

  self.urlModel = function urlModel(newUrl) {
    if (arguments.length) {
      // eslint-disable-next-line no-return-assign
      return (self.numberCtrl.number.feature.url = !isEmpty(newUrl)
        ? self.model.urlProtocol + newUrl
        : '');
    }
    return self.numberCtrl.number.feature.url.replace(protocolRegexp, '');
  };

  self.urlRecordModel = function urlRecordModel(newUrl) {
    if (arguments.length) {
      // eslint-disable-next-line no-return-assign
      return (self.numberCtrl.number.feature.urlRecord = !isEmpty(newUrl)
        ? self.model.urlRecordProtocol + newUrl
        : '');
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
  self.updateUrlProtocol = function updateUrlProtocol() {
    const urlValue = self.numberCtrl.number.feature.url.replace(
      protocolRegexp,
      '',
    );
    self.sviConfigForm.url.$setDirty(true);
    self.numberCtrl.number.feature.url = !isEmpty(urlValue)
      ? self.model.urlProtocol + urlValue
      : '';
  };

  /**
   *  Called when url record protocol change. Update the urlRecord value of the feature.
   */
  self.updateUrlRecordProtocol = function updateUrlRecordProtocol() {
    const urlValue = self.numberCtrl.number.feature.urlRecord.replace(
      protocolRegexp,
      '',
    );
    self.sviConfigForm.urlRecord.$setDirty(true);
    self.numberCtrl.number.feature.urlRecord = !isEmpty(urlValue)
      ? self.model.urlRecordProtocol + urlValue
      : '';
  };

  /**
   *  Called on config button clicked.
   */
  self.togglePopover = function togglePopover() {
    self.popoverOpen = !self.popoverOpen;
    if (self.popoverOpen) {
      self.numberCtrl.number.feature.startEdition();
      self.model.urlProtocol = getProtocol(self.numberCtrl.number.feature.url);
      self.model.urlRecordProtocol = getProtocol(
        self.numberCtrl.number.feature.urlRecord,
      );
    } else {
      self.numberCtrl.number.feature.stopEdition(true);
    }
  };

  /**
   *  Called when submit is clicked. Configuration is OK, so we start to save the svi feature.
   */
  self.onPopoverValidate = function onPopoverValidate() {
    self.popoverOpen = false;
    return self.numberCtrl.saveNumber();
  };

  /**
   *  Called when cancel button is clicked.
   *  We stop feature configuration and rollback to previous configuration.
   */
  self.onPopoverCancel = function onPopoverCancel() {
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
  self.$onInit = function $onInit() {
    // set save feature function
    self.numberCtrl.saveFeature = saveFeature;
  };

  /**
   *  Stop feature when component is destroyed.
   */
  self.$onDestroy = function $onDestroy() {
    self.numberCtrl.number.feature.stopEdition(true);
  };

  /* -----  End of INITIALIZATION  ------*/
}
