import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

export default /* @ngInject */ (
  $q,
  voipTimeCondition,
  VoipTimeConditionCondition,
  VoipTimeConditionSlot,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function VoipTimeCondition(options) {
    const opts = options || {};

    // options check
    if (!opts.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new VoipTimeCondition',
      );
    }
    if (!opts.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new VoipTimeCondition',
      );
    }
    if (!opts.featureType) {
      throw new Error(
        'featureType option must be specified when creating a new VoipTimeCondition',
      );
    }

    // mandatory
    this.billingAccount = opts.billingAccount;
    this.serviceName = opts.serviceName;
    this.featureType = opts.featureType;

    // check for mandatory field required by ovhPabx feature type
    if (this.featureType === 'ovhPabx') {
      if (!opts.extensionId) {
        throw new Error(
          'extensionId option must be specified when creating a new VoipTimeCondition',
        );
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

  VoipTimeCondition.prototype.setOptions = function setOptions(options) {
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
    const availableSlot = find(self.slots, {
      name: 'available',
    });

    if (availableSlot) {
      availableSlot.setOptions({
        number: self.serviceName,
      });
    } else {
      self.slots.push(
        new VoipTimeConditionSlot({
          name: 'available',
          serviceName: self.serviceName,
          number: self.serviceName,
        }),
      );
    }

    // set unavailable slot
    const unavailableSlot = find(self.slots, {
      name: 'unavailable',
    });

    if (unavailableSlot) {
      unavailableSlot.setOptions({
        type: opts.unavailableType || 'number',
        number: opts.unavailableNumber || '',
      });
    } else {
      self.slots.push(
        new VoipTimeConditionSlot({
          name: 'unavailable',
          serviceName: self.serviceName,
          type: opts.unavailableType || 'number',
          number: opts.unavailableNumber || '',
        }),
      );
    }

    // set slot types
    for (
      let i = 0;
      i < voipTimeCondition.getAvailableSlotsCount(self.featureType);
      i += 1
    ) {
      tmpSlotNumber = i + 1;
      tmpSlotName = `slot${tmpSlotNumber}`;
      tmpSlot = find(self.slots, {
        name: tmpSlotName,
      });

      if (tmpSlot) {
        tmpSlot.setOptions({
          type: get(opts, `${tmpSlotName}Type`) || 'number',
          number: get(opts, `${tmpSlotName}Number`) || '',
        });
      } else {
        self.slots.push(
          new VoipTimeConditionSlot({
            serviceName: self.serviceName,
            name: tmpSlotName,
            type: get(opts, `${tmpSlotName}Type`) || 'number',
            number: get(opts, `${tmpSlotName}Number`) || '',
          }),
        );
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

  VoipTimeCondition.prototype.init = function init() {
    const self = this;
    const getResource = voipTimeCondition.getResource('init', self.featureType);

    return getResource(
      voipTimeCondition.getResourceCallParams(self),
    ).$promise.then((options) => self.setOptions(options));
  };

  VoipTimeCondition.prototype.save = function save() {
    const self = this;
    const saveResource = voipTimeCondition.getResource(
      'save',
      self.featureType,
    );

    return saveResource(
      voipTimeCondition.getResourceCallParams(self),
      voipTimeCondition.getResourceCallActionParams(self),
    ).$promise;
  };

  VoipTimeCondition.prototype.saveConditions = function saveConditions() {
    const self = this;
    const savePromises = [];
    let actionPromise;

    filter(self.conditions, (condition) =>
      condition.hasChange(null, true),
    ).forEach((condition) => {
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

  VoipTimeCondition.prototype.getConditions = function getConditions() {
    const self = this;
    const conditionResources = voipTimeCondition.getResource(
      'condition',
      self.featureType,
    );

    return conditionResources
      .query(voipTimeCondition.getResourceCallParams(self))
      .$promise.then((conditionIds) =>
        $q
          .all(
            map(chunk(conditionIds, 50), (chunkIds) =>
              conditionResources
                .getBatch(
                  voipTimeCondition.getConditionResourceCallParams(
                    self,
                    chunkIds,
                  ),
                )
                .$promise.then((resources) => {
                  angular.forEach(
                    map(resources, 'value'),
                    (conditionOptions) => {
                      self.addCondition(conditionOptions);
                    },
                  );
                }),
            ),
          )
          .then(() => self),
      );
  };

  VoipTimeCondition.prototype.addCondition = function addCondition(
    conditionOptions,
  ) {
    const self = this;
    let condition = null;
    const opts = conditionOptions || {};

    if (opts.conditionId) {
      condition = find(self.conditions, {
        conditionId: opts.conditionId,
      });
    } else if (opts.id) {
      condition = find(self.conditions, {
        conditionId: opts.id,
      });
    }

    if (condition) {
      condition.setOptions(opts);
    } else {
      condition = new VoipTimeConditionCondition(
        angular.extend(opts, voipTimeCondition.getResourceCallParams(self), {
          featureType: self.featureType,
        }),
      );
      self.conditions.push(condition);
    }

    return condition;
  };

  VoipTimeCondition.prototype.removeCondition = function removeCondition(
    condition,
  ) {
    const self = this;

    remove(self.conditions, condition);

    return self;
  };

  VoipTimeCondition.prototype.getCondition = function getCondition(
    conditionId,
  ) {
    const self = this;

    return find(self.conditions, {
      conditionId,
    });
  };

  /* ----------  EDITION  ----------*/

  VoipTimeCondition.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {};

    if (self.featureType === 'ovhPabx') {
      return self;
    }

    // save enable state
    set(self.saveForEdition, 'enable', angular.copy(self.enable));

    // save timeout if sip feature type
    if (self.featureType === 'sip') {
      set(self.saveForEdition, 'timeout', angular.copy(self.timeout));
    }

    return self;
  };

  VoipTimeCondition.prototype.stopEdition = function stopEdition(cancel) {
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

  VoipTimeCondition.prototype.stopSlotsEdition = function stopSlotsEdition(
    cancel,
    cancelOriginalSave,
    resetOriginalSave,
  ) {
    const self = this;

    angular.forEach(self.slots, (slot) => {
      slot.stopEdition(cancel, cancelOriginalSave, resetOriginalSave);
    });

    return self;
  };

  VoipTimeCondition.prototype.stopConditionsEdition = function stopConditionsEdition(
    cancel,
    cancelOriginalSave,
    resetOriginalSave,
  ) {
    const self = this;

    angular.forEach(self.conditions, (condition) => {
      if (condition.state === 'TO_CREATE' || condition.state === 'DRAFT') {
        self.removeCondition(condition);
      } else {
        if (condition.state === 'TO_DELETE') {
          set(condition, 'state', 'OK');
        }
        condition.stopEdition(cancel, cancelOriginalSave, resetOriginalSave);
      }
    });

    return self;
  };

  VoipTimeCondition.prototype.hasChange = function hasChange(property) {
    const self = this;

    if (!self.saveForEdition) {
      return false;
    }

    if (property) {
      switch (property) {
        case 'slots':
          return some(
            self.slots,
            (slot) => !slot.inEdition && slot.hasChange(null, true),
          );
        case 'conditions':
          return some(self.conditions, (condition) =>
            condition.hasChange(null, true),
          );
        default:
          return !isEqual(
            get(self, property),
            get(self.saveForEdition, property),
          );
      }
    } else {
      switch (self.featureType) {
        case 'sip':
          return (
            self.hasChange('enable') ||
            self.hasChange('timeout') ||
            self.hasChange('slots') ||
            self.hasChange('conditions')
          );
        case 'easyHunting':
          return (
            self.hasChange('enable') ||
            self.hasChange('slots') ||
            self.hasChange('conditions')
          );
        default:
          return false;
      }
    }
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return VoipTimeCondition;
};
