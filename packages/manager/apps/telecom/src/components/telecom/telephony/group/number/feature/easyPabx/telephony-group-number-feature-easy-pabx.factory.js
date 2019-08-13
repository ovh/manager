angular.module('managerApp').factory('TelephonyGroupNumberEasyPabx', ($q, VoipScheduler, VoipTimeCondition, OvhApiTelephonyEasyPabx) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberEasyPabx(featureOptions) {
    // check for mandatory options
    if (!featureOptions) {
      throw new Error('mandatory options must be specified when creating a new TelephonyGroupNumberEasyPabx');
    } else {
      if (!featureOptions.billingAccount) {
        throw new Error('billingAccount option must be specified when creating a new TelephonyGroupNumberEasyPabx');
      }

      if (!featureOptions.serviceName) {
        throw new Error('serviceName option must be specified when creating a new TelephonyGroupNumberEasyPabx');
      }

      if (!featureOptions.featureType) {
        throw new Error('featureType option must be specified when creating a new TelephonyGroupNumberEasyPabx');
      }
    }

    // set mandatory attributes
    this.billingAccount = featureOptions.billingAccount;
    this.serviceName = featureOptions.serviceName;
    this.featureType = featureOptions.featureType;

    // set feature options
    this.setOptions(featureOptions);

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;

    this.scheduler = null;
    this.timeCondition = null;
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.setOptions = function () {
    const self = this;

    return self;
  };

  /* ----------  HELPERS  ----------*/

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.startEdition = function () {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      featureType: angular.copy(self.featureType),
    };

    return self;
  };

  TelephonyGroupNumberEasyPabx.prototype.stopEdition = function (cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.featureType = angular.copy(self.saveForEdition.featureType);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberEasyPabx.prototype.hasChange = function (attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !_.isEqual(_.get(self.saveForEdition, attr), _.get(self, attr));
    }
    return self.hasChange('featureType');
  };

  /* ----------  SCHEDULER  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.getScheduler = function () {
    const self = this;

    if (!self.scheduler) {
      self.scheduler = new VoipScheduler({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      });
    }

    return self.scheduler.get();
  };

  /* ----------  TIMECONDITION  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.getTimeCondition = function () {
    const self = this;

    if (!self.timeCondition) {
      self.timeCondition = new VoipTimeCondition({
        featureType: 'sip',
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      });
    }

    return self.timeCondition.init();
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.inPendingState = function () {
    return false;
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberEasyPabx.prototype.init = function () {
    const self = this;

    return OvhApiTelephonyEasyPabx.v6().get({
      billingAccount: self.billingAccount,
      serviceName: self.serviceName,
    }).$promise.then(featureOptions => self.setOptions(featureOptions));
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberEasyPabx;
});
