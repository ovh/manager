import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

/**
 *  This factory manages the svi feature of a number (vxml for API)
 *  This manages the svi featureType of /telephony/{billingAccount}/number API.
 */
export default /* @ngInject */ ($q, OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberSvi(featureOptionsParam) {
    let featureOptions = featureOptionsParam;

    // check for mandatory options
    if (!featureOptions) {
      featureOptions = {};
    }

    // check mandatory fields
    if (!featureOptions.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumberSvi',
      );
    }

    if (!featureOptions.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumberSvi',
      );
    }

    if (!featureOptions.featureType) {
      throw new Error(
        'featureType option must be specified when creating a new TelephonyGroupNumberSvi',
      );
    }

    // set mandatory attributes
    this.billingAccount = featureOptions.billingAccount;
    this.serviceName = featureOptions.serviceName;
    this.featureType = featureOptions.featureType;

    // other attributes
    this.url = null;
    this.urlRecord = null;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;

    // set feature options
    this.setInfos(featureOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupNumberSvi.prototype.setInfos = function setInfos(
    featureOptionsParam,
  ) {
    const self = this;
    let featureOptions = featureOptionsParam;

    if (!featureOptions) {
      featureOptions = {};
    }

    self.url = featureOptions.url || '';
    self.urlRecord = featureOptions.urlRecord || '';

    return self;
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberSvi.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      featureType: angular.copy(self.featureType),
      url: angular.copy(self.url),
      urlRecord: angular.copy(self.urlRecord),
    };

    return self;
  };

  TelephonyGroupNumberSvi.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.featureType = angular.copy(self.saveForEdition.featureType);
      self.url = angular.copy(self.saveForEdition.url);
      self.urlRecord = angular.copy(self.saveForEdition.urlRecord);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberSvi.prototype.hasChange = function hasChange(attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !isEqual(get(self.saveForEdition, attr), get(self, attr));
    }
    return (
      self.hasChange('featureType') ||
      self.hasChange('url') ||
      self.hasChange('urlRecord')
    );
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroupNumberSvi.prototype.save = function save() {
    const self = this;

    return OvhApiTelephony.Vxml()
      .v6()
      .save(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          url: self.url,
          urlRecord: self.urlRecord,
        },
      )
      .$promise.then(() => self);
  };

  TelephonyGroupNumberSvi.prototype.getSettings = function getSettings() {
    const self = this;

    return OvhApiTelephony.Vxml()
      .v6()
      .settings({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (settings) => self.setInfos(settings),
        (error) => {
          if (error.status === 404) {
            return self;
          }
          return $q.reject(error);
        },
      );
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberSvi.prototype.inPendingState = function inPendingState() {
    return true;
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberSvi.prototype.init = function init() {
    const self = this;

    return OvhApiTelephony.Vxml()
      .v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(() => self.getSettings());
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberSvi;
};
