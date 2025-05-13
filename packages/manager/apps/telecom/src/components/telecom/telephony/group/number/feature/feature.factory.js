import keys from 'lodash/keys';

export default /* @ngInject */ ($q) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberFeature(mandatoryOptions, featureOptionsParam) {
    let featureOptions = featureOptionsParam;

    // check for mandatory options
    if (!mandatoryOptions) {
      throw new Error(
        'mandatory options must be specified when creating a new TelephonyGroupNumberFeature',
      );
    } else {
      if (!mandatoryOptions.billingAccount) {
        throw new Error(
          'billingAccount option must be specified when creating a new TelephonyGroupNumberFeature',
        );
      }

      if (!mandatoryOptions.serviceName) {
        throw new Error(
          'serviceName option must be specified when creating a new TelephonyGroupNumberFeature',
        );
      }

      if (!mandatoryOptions.featureType) {
        throw new Error(
          'featureType option must be specified when creating a new TelephonyGroupNumberFeature',
        );
      }
    }

    if (!featureOptions) {
      featureOptions = {};
    }

    // set mandatory attributes
    this.billingAccount = mandatoryOptions.billingAccount;
    this.serviceName = mandatoryOptions.serviceName;
    this.featureType = mandatoryOptions.featureType;

    // set feature options
    this.setInfos(featureOptions);

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupNumberFeature.prototype.setInfos = function setInfos(
    featureOptions,
  ) {
    const self = this;

    angular.forEach(keys(featureOptions), (featureOptionKey) => {
      self[featureOptionKey] = featureOptions[featureOptionKey];
    });

    return self;
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberFeature.prototype.startEdition = function startEdition(
    attrsToSave,
  ) {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {};
    angular.forEach(attrsToSave || ['featureType'], (attr) => {
      self.saveForEdition[attr] = angular.copy(self[attr]);
    });

    return self;
  };

  TelephonyGroupNumberFeature.prototype.stopEdition = function stopEdition(
    cancel,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      angular.forEach(keys(self.saveForEdition), (editionKey) => {
        self[editionKey] = angular.copy(self.saveForEdition[editionKey]);
      });
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberFeature.prototype.hasChange = function hasChangeFunction(
    attr,
  ) {
    const self = this;
    let hasChange = false;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return self[attr] !== self.saveForEdition[attr];
    }
    angular.forEach(keys(self.saveForEdition), (attrKey) => {
      if (!hasChange) {
        hasChange = self.hasChange(attrKey);
      }
    });

    return hasChange;
  };

  /* ----------  HELPERS  ----------*/

  TelephonyGroupNumberFeature.prototype.inPendingState = function inPendingState() {
    return false;
  };

  /* ----------  INITIALIZATION  ----------*/

  TelephonyGroupNumberFeature.prototype.init = function init() {
    const self = this;

    return $q.when(self);
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberFeature;
};
