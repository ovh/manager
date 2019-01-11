angular.module('managerApp').factory('VoipTimeCondition', ($q, voipTimeCondition, VoipTimeConditionCondition, VoipTimeConditionSlot) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function VoipTimeCondition(options) {
    const opts = options || {};

    // options check
    if (!opts.billingAccount) {
      throw new Error('billingAccount option must be specified when creating a new VoipTimeCondition');
    }
    if (!opts.serviceName) {
      throw new Error('serviceName option must be specified when creating a new VoipTimeCondition');
    }
    if (!opts.featureType) {
      throw new Error('featureType option must be specified when creating a new VoipTimeCondition');
    }

    // mandatory
    this.billingAccount = opts.billingAccount;
    this.serviceName = opts.serviceName;
    this.featureType = opts.featureType;

    // check for mandatory field required by ovhPabx feature type
    if (this.featureType === 'ovhPabx') {
      if (!opts.extensionId) {
        throw new Error('extensionId option must be specified when creating a new VoipTimeCondition');
      }

      this.extensionId = opts.extensionId;
    }

    // from api
    this.slots = [];
    this.setOptions(opts);

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.status = 'OK';
    this.conditions = [];
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  VoipTimeCondition.prototype.setOptions = function (options) {
    const self = this;
    let tmpSlotNumber;
    let tmpSlotName;
    let tmpSlot;
    const opts = options || {};

    if (self.featureType === 'ovhPabx') {
      // no options for ovhPabx
      return self;
    }

    // set available slot
    const availableSlot = _.find(self.slots, {
      name: 'available',
    });

    if (availableSlot) {
      availableSlot.setOptions({
        number: self.serviceName,
      });
    } else {
      self.slots.push(new VoipTimeConditionSlot({
        name: 'available',
        serviceName: self.serviceName,
        number: self.serviceName,
      }));
    }

    // set unavailable slot
    const unavailableSlot = _.find(self.slots, {
      name: 'unavailable',
    });

    if (unavailableSlot) {
      unavailableSlot.setOptions({
        type: opts.unavailableType || 'number',
        number: opts.unavailableNumber || '',
      });
    } else {
      self.slots.push(new VoipTimeConditionSlot({
        name: 'unavailable',
        serviceName: self.serviceName,
        type: opts.unavailableType || 'number',
        number: opts.unavailableNumber || '',
      }));
    }

    // set slot types
    for (let i = 0; i < voipTimeCondition.getAvailableSlotsCount(self.featureType); i += 1) {
      tmpSlotNumber = i + 1;
      tmpSlotName = `slot${tmpSlotNumber}`;
      tmpSlot = _.find(self.slots, {
        name: tmpSlotName,
      });

      if (tmpSlot) {
        tmpSlot.setOptions({
          type: _.get(opts, `${tmpSlotName}Type`) || 'number',
          number: _.get(opts, `${tmpSlotName}Number`) || '',
        });
      } else {
        self.slots.push(new VoipTimeConditionSlot({
          serviceName: self.serviceName,
          name: tmpSlotName,
          type: _.get(opts, `${tmpSlotName}Type`) || 'number',
          number: _.get(opts, `${tmpSlotName}Number`) || '',
        }));
      }
    }

    // set timeout option for sip feature type and enable state
    if (self.featureType === 'sip') {
      self.timeout = opts.timeout || 45;
      self.enable = opts.status === 'enabled';
    } else {
      self.enable = opts.enable || false;
    }

    return self;
  };

  /* ----------  API Calls  ----------*/

  VoipTimeCondition.prototype.init = function () {
    const self = this;
    const getResource = voipTimeCondition.getResource('init', self.featureType);

    return getResource(voipTimeCondition
      .getResourceCallParams(self)).$promise
      .then(options => self.setOptions(options));
  };

  VoipTimeCondition.prototype.save = function () {
    const self = this;
    const saveResource = voipTimeCondition.getResource('save', self.featureType);

    return saveResource(
      voipTimeCondition.getResourceCallParams(self),
      voipTimeCondition.getResourceCallActionParams(self),
    ).$promise;
  };

  VoipTimeCondition.prototype.saveConditions = function () {
    const self = this;
    const savePromises = [];
    let actionPromise;

    _.filter(self.conditions, condition => condition.hasChange(null, true)).forEach((condition) => {
      if (condition.state === 'TO_CREATE') {
        actionPromise = condition.create().then(() => {
          condition.stopEdition(false, false, true);
        });
        savePromises.push(actionPromise);
      } else if (condition.state === 'TO_DELETE') {
        actionPromise = condition.remove().then(() => {
          self.removeCondition(condition);
        });
        savePromises.push(actionPromise);
      } else if (condition.state === 'OK') {
        actionPromise = condition.save().then(() => {
          condition.stopEdition(false, false, true);
        });
        savePromises.push(actionPromise);
      }
    });

    return $q.allSettled(savePromises);
  };

  /* ----------  CONDITIONS  ----------*/

  VoipTimeCondition.prototype.getConditions = function () {
    const self = this;
    const conditionResources = voipTimeCondition.getResource('condition', self.featureType);

    return conditionResources
      .query(voipTimeCondition.getResourceCallParams(self)).$promise
      .then(conditionIds => $q
        .all(_.map(
          _.chunk(conditionIds, 50),
          chunkIds => conditionResources
            .getBatch(voipTimeCondition.getConditionResourceCallParams(self, chunkIds))
            .$promise
            .then((resources) => {
              angular.forEach(_.map(resources, 'value'), (conditionOptions) => {
                self.addCondition(conditionOptions);
              });
            }),
        ))
        .then(() => self));
  };

  VoipTimeCondition.prototype.addCondition = function (conditionOptions) {
    const self = this;
    let condition = null;
    const opts = conditionOptions || {};

    if (opts.conditionId) {
      condition = _.find(self.conditions, {
        conditionId: opts.conditionId,
      });
    } else if (opts.id) {
      condition = _.find(self.conditions, {
        conditionId: opts.id,
      });
    }

    if (condition) {
      condition.setOptions(opts);
    } else {
      condition = new VoipTimeConditionCondition(angular.extend(opts, voipTimeCondition
        .getResourceCallParams(self), {
        featureType: self.featureType,
      }));
      self.conditions.push(condition);
    }

    return condition;
  };

  VoipTimeCondition.prototype.removeCondition = function (condition) {
    const self = this;

    _.remove(self.conditions, condition);

    return self;
  };

  VoipTimeCondition.prototype.getCondition = function (conditionId) {
    const self = this;

    return _.find(self.conditions, {
      conditionId,
    });
  };

  /* ----------  EDITION  ----------*/

  VoipTimeCondition.prototype.startEdition = function () {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {};

    if (self.featureType === 'ovhPabx') {
      return self;
    }

    // save enable state
    _.set(self.saveForEdition, 'enable', angular.copy(self.enable));

    // save timeout if sip feature type
    if (self.featureType === 'sip') {
      _.set(self.saveForEdition, 'timeout', angular.copy(self.timeout));
    }

    return self;
  };

  VoipTimeCondition.prototype.stopEdition = function (cancel) {
    const self = this;

    if (self.featureType !== 'ovhPabx' && self.saveForEdition && cancel) {
      // reset enable state
      self.enable = angular.copy(self.saveForEdition.enable);

      // reset timeout if sip feature type
      if (self.featureType === 'sip') {
        self.timeout = angular.copy(self.saveForEdition.timeout);
      }
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  VoipTimeCondition.prototype.stopSlotsEdition = function (cancel, cancelOriginalSave,
    resetOriginalSave) {
    const self = this;

    angular.forEach(self.slots, (slot) => {
      slot.stopEdition(cancel, cancelOriginalSave, resetOriginalSave);
    });

    return self;
  };

  VoipTimeCondition.prototype.stopConditionsEdition = function (cancel, cancelOriginalSave,
    resetOriginalSave) {
    const self = this;

    angular.forEach(self.conditions, (condition) => {
      if (condition.state === 'TO_CREATE' || condition.state === 'DRAFT') {
        self.removeCondition(condition);
      } else {
        if (condition.state === 'TO_DELETE') {
          _.set(condition, 'state', 'OK');
        }
        condition.stopEdition(cancel, cancelOriginalSave, resetOriginalSave);
      }
    });

    return self;
  };

  VoipTimeCondition.prototype.hasChange = function (property) {
    const self = this;

    if (!self.saveForEdition) {
      return false;
    }

    if (property) {
      switch (property) {
        case 'slots':
          return _.some(self.slots, slot => !slot.inEdition && slot.hasChange(null, true));
        case 'conditions':
          return _.some(self.conditions, condition => condition.hasChange(null, true));
        default:
          return !_.isEqual(_.get(self, property), _.get(self.saveForEdition, property));
      }
    } else {
      switch (self.featureType) {
        case 'sip':
          return self.hasChange('enable') || self.hasChange('timeout') || self.hasChange('slots') || self.hasChange('conditions');
        case 'easyHunting':
          return self.hasChange('enable') || self.hasChange('slots') || self.hasChange('conditions');
        default:
          return false;
      }
    }
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return VoipTimeCondition;
});
