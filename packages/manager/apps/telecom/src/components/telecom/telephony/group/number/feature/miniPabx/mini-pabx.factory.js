import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

export default /* @ngInject */ (
  $q,
  VoipScheduler,
  VoipTimeCondition,
  OvhApiTelephonyMiniPabx,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberMiniPabx(featureOptions) {
    // check for mandatory options
    if (!featureOptions) {
      throw new Error(
        'mandatory options must be specified when creating a new TelephonyGroupNumberMiniPabx',
      );
    } else {
      if (!featureOptions.billingAccount) {
        throw new Error(
          'billingAccount option must be specified when creating a new TelephonyGroupNumberMiniPabx',
        );
      }

      if (!featureOptions.serviceName) {
        throw new Error(
          'serviceName option must be specified when creating a new TelephonyGroupNumberMiniPabx',
        );
      }

      if (!featureOptions.featureType) {
        throw new Error(
          'featureType option must be specified when creating a new TelephonyGroupNumberMiniPabx',
        );
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

  TelephonyGroupNumberMiniPabx.prototype.setOptions = function setOptions() {
    const self = this;

    return self;
  };

  /* ----------  HELPERS  ----------*/

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberMiniPabx.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      featureType: angular.copy(self.featureType),
    };

    return self;
  };

  TelephonyGroupNumberMiniPabx.prototype.stopEdition = function stopEdition(
    cancel,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.featureType = angular.copy(self.saveForEdition.featureType);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberMiniPabx.prototype.hasChange = function hasChange(attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !isEqual(get(self.saveForEdition, attr), get(self, attr));
    }
    return self.hasChange('featureType');
  };

  /* ----------  SCHEDULER  ----------*/

  TelephonyGroupNumberMiniPabx.prototype.getScheduler = function getScheduler() {
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

  TelephonyGroupNumberMiniPabx.prototype.getTimeCondition = function getTimeCondition() {
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

  TelephonyGroupNumberMiniPabx.prototype.inPendingState = function inPendingState() {
    return false;
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberMiniPabx.prototype.init = function init() {
    const self = this;

    return OvhApiTelephonyMiniPabx.v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then((featureOptions) => self.setOptions(featureOptions));
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberMiniPabx;
};
