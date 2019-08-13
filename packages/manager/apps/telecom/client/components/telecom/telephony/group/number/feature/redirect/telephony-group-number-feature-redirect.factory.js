/**
 *  This factory manages the redirect feature of a number.
 *  This manages the redirect and ddi featureType of /telephony/{billingAccount}/number API.
 */
angular.module('managerApp').factory('TelephonyGroupNumberRedirect', ($q, OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberRedirect(featureOptionsParam) {
    let featureOptions = featureOptionsParam;

    // check for mandatory options
    if (!featureOptions) {
      featureOptions = {};
    }

    // check mandatory fields
    if (!featureOptions.billingAccount) {
      throw new Error('billingAccount option must be specified when creating a new TelephonyGroupNumberRedirect');
    }

    if (!featureOptions.serviceName) {
      throw new Error('serviceName option must be specified when creating a new TelephonyGroupNumberRedirect');
    }

    if (!featureOptions.featureType) {
      throw new Error('featureType option must be specified when creating a new TelephonyGroupNumberRedirect');
    }

    // set mandatory attributes
    this.billingAccount = featureOptions.billingAccount;
    this.serviceName = featureOptions.serviceName;
    this.featureType = featureOptions.featureType;

    // other attributes
    this.destination = null;

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

  TelephonyGroupNumberRedirect.prototype.setInfos = function (featureOptionsParam) {
    const self = this;
    let featureOptions = featureOptionsParam;

    if (!featureOptions) {
      featureOptions = {};
    }

    this.destination = featureOptions.destination;

    return self;
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberRedirect.prototype.startEdition = function () {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      featureType: angular.copy(self.featureType),
      destination: angular.copy(self.destination),
    };

    return self;
  };

  TelephonyGroupNumberRedirect.prototype.stopEdition = function (cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.featureType = angular.copy(self.saveForEdition.featureType);
      self.destination = angular.copy(self.saveForEdition.destination);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberRedirect.prototype.hasChange = function (attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !_.isEqual(_.get(self.saveForEdition, attr), _.get(self, attr));
    }
    return self.hasChange('featureType') || self.hasChange('destination');
  };

  TelephonyGroupNumberRedirect.prototype.save = function () {
    const self = this;

    if (!self.hasChange('destination')) {
      return $q.when(self);
    }

    return OvhApiTelephony.Redirect().v6().change({
      billingAccount: self.billingAccount,
      featureType: self.featureType,
      serviceName: self.serviceName,
    }, {
      destination: self.destination,
    }).$promise;
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberRedirect.prototype.inPendingState = function () {
    const self = this;
    return self.destination === 'pending';
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberRedirect.prototype.init = function () {
    const self = this;

    return OvhApiTelephony.Redirect().v6().get({
      billingAccount: self.billingAccount,
      featureType: self.featureType,
      serviceName: self.serviceName,
    }).$promise.then((options) => {
      self.setInfos(options);
      return self;
    });
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberRedirect;
});
