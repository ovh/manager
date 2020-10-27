import upperFirst from 'lodash/upperFirst';
import filter from 'lodash/filter';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';

export default /* @ngInject */ (
  $q,
  $injector,
  OvhApiTelephony,
  tucVoipServiceTask,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumber(optionsParam) {
    let options = optionsParam;

    if (!options) {
      options = {};
    }

    // options check
    if (!options.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroupNumber',
      );
    }

    if (!options.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new TelephonyGroupNumber',
      );
    }

    // mandatory
    this.billingAccount = options.billingAccount;
    this.serviceName = options.serviceName;

    // from API
    this.serviceType = options.serviceType;
    this.description = options.description;
    this.partOfPool = options.partOfPool;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;

    this.feature = this.getFeature(options.featureType);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupNumber.prototype.getDisplayedName = function getDisplayedName() {
    const self = this;

    return self.description || self.serviceName;
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroupNumber.prototype.save = function save() {
    const self = this;
    const savePromises = [];

    if (self.hasChange('description')) {
      savePromises.push(
        OvhApiTelephony.Number()
          .v6()
          .edit(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
            },
            {
              description: self.description,
            },
          ).$promise,
      );
    }

    return $q.allSettled(savePromises);
  };

  /* ----------  FEATURE  ----------*/

  TelephonyGroupNumber.prototype.getFeature = function getFeature(
    featureType,
    refresh,
  ) {
    const self = this;

    if (self.feature && !refresh) {
      return self.feature;
    }

    const FeatureTypeFactory = $injector.get(
      `TelephonyGroupNumber${upperFirst(self.getFeatureFamily(featureType))}`,
    );

    if (!FeatureTypeFactory) {
      console.log(
        `TelephonyGroupNumber${upperFirst(
          self.getFeatureFamily(featureType),
        )} is missing`,
      );
      throw new Error(
        `TelephonyGroupNumber${upperFirst(
          self.getFeatureFamily(featureType),
        )} is missing`,
      );
    }

    return new FeatureTypeFactory({
      billingAccount: self.billingAccount,
      serviceName: self.serviceName,
      featureType,
    });
  };

  TelephonyGroupNumber.prototype.getFeatureFamily = function getFeatureFamily(
    featureTypeParam,
  ) {
    const self = this;
    let featureType = featureTypeParam;

    if (!featureType && self.feature) {
      featureType = self.feature.featureType;
    }

    switch (featureType) {
      case 'redirect':
      case 'ddi':
        return 'redirect';
      case 'conference':
        return 'conference';
      case 'cloudIvr':
      case 'cloudHunting':
      case 'contactCenterSolutionExpert':
        return 'ovhPabx';
      case 'svi':
        return 'svi';
      case 'easyHunting':
      case 'contactCenterSolution':
        return 'easyHunting';
      case 'easyPabx':
        return 'easyPabx';
      case 'miniPabx':
        return 'miniPabx';
      default:
        return 'feature';
    }
  };

  TelephonyGroupNumber.prototype.changeFeatureType = function changeFeatureType() {
    const self = this;

    return OvhApiTelephony.Number()
      .v6()
      .changeFeatureType(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
        },
        {
          featureType: self.feature.featureType,
        },
      )
      .$promise.then((task) =>
        tucVoipServiceTask
          .startPolling(self.billingAccount, self.serviceName, task.taskId, {
            namespace: `numberChangeTypeTask_${self.serviceName}`,
            interval: 1000,
            retryMaxAttempts: 0,
          })
          .then(() => {
            self.feature = self.getFeature(self.feature.featureType, true);
            return self.feature.init(true).then(() => self);
          }),
      );
  };

  /* ----------  TASK  ----------*/

  TelephonyGroupNumber.prototype.getTerminationTask = function getTerminationTask() {
    const self = this;
    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        action: 'termination',
        type: 'offer',
      })
      .$promise.then((offerTaskIds) =>
        $q
          .all(
            map(
              offerTaskIds,
              (id) =>
                OvhApiTelephony.Service()
                  .OfferTask()
                  .v6()
                  .get({
                    billingAccount: self.billingAccount,
                    serviceName: self.serviceName,
                    taskId: id,
                  }).$promise,
            ),
          )
          .then((tasks) => head(filter(tasks, { status: 'todo' }))),
      );
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumber.prototype.startEdition = function startEdition(
    startFeatureEdition,
  ) {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      description: angular.copy(self.description),
    };

    if (startFeatureEdition) {
      self.feature.startEdition();
    }

    return self;
  };

  TelephonyGroupNumber.prototype.stopEdition = function stopEdition(
    cancel,
    stopFeatureEdition,
  ) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.description = angular.copy(self.saveForEdition.description);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    if (stopFeatureEdition) {
      self.feature.stopEdition(cancel);
    }

    return self;
  };

  TelephonyGroupNumber.prototype.hasChange = function hasChange(attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      switch (attr) {
        case 'description':
          return !isEqual(self.saveForEdition.description, self.description);
        case 'feature':
          return self.feature.hasChange();
        default:
          return false;
      }
    } else {
      return self.hasChange('description') || self.hasChange('feature');
    }
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumber;
};
