import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import now from 'lodash/now';
import random from 'lodash/random';

import { VOIP_TIMECONDITION_ORDERED_DAYS } from '../time-condition.constant';

export default /* @ngInject */ (voipTimeCondition) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function VoipTimeConditionCondition(conditionOptions) {
    const opts = conditionOptions || {};

    // options check
    if (!opts.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new VoipTimeConditionCondition',
      );
    }
    if (!opts.serviceName) {
      throw new Error(
        'serviceName option must be specified when creating a new VoipTimeConditionCondition',
      );
    }
    if (!opts.featureType) {
      throw new Error(
        'featureType option must be specified when creating a new VoipTimeConditionCondition',
      );
    }

    // mandatory
    this.billingAccount = opts.billingAccount;
    this.serviceName = opts.serviceName;
    this.featureType = opts.featureType;

    // check for mandatory field required by ovhPabx feature type
    if (this.featureType === 'ovhPabx') {
      if (!opts.dialplanId) {
        throw new Error(
          'dialplanId option must be specified when creating a new VoipTimeConditionCondition',
        );
      }
      if (!opts.extensionId) {
        throw new Error(
          'extensionId option must be specified when creating a new VoipTimeConditionCondition',
        );
      }

      this.dialplanId = opts.dialplanId;
      this.extensionId = opts.extensionId;
    }

    // from api
    this.setOptions(opts);

    // other attributes
    this.conditionId =
      get(opts, this.featureType === 'sip' ? 'id' : 'conditionId') ||
      `tmp_${random(now())}`;
    this.state = get(opts, 'state') || 'OK';
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  VoipTimeConditionCondition.prototype.setOptions = function setOptions(
    conditionOptions,
  ) {
    const self = this;
    let timeFrom;
    let timeTo;

    self.weekDay =
      get(conditionOptions, self.featureType === 'sip' ? 'day' : 'weekDay') ||
      'monday';
    if (
      (self.featureType === 'sip' && conditionOptions.state === 'DRAFT') ||
      (self.featureType === 'sip' && conditionOptions.id)
    ) {
      timeFrom = get(conditionOptions, 'hourBegin');
      timeTo = get(conditionOptions, 'hourEnd');

      self.timeFrom = timeFrom
        ? voipTimeCondition.parseSipTime(timeFrom)
        : '08:30:00';
      self.timeTo = timeTo
        ? voipTimeCondition.parseSipTime(timeTo, true)
        : '17:29:59';
      self.status = conditionOptions.status || 'new'; // donno what is this status ???
    } else {
      timeTo = get(conditionOptions, 'timeTo');

      self.timeFrom = get(conditionOptions, 'timeFrom') || '08:30:00';

      // because in v4 timeTo is something like this : 10:00:59.
      // Format it to something like 09:59:59
      self.timeTo = timeTo
        ? voipTimeCondition.parseTime(get(conditionOptions, 'timeTo'))
        : '17:29:59';
    }
    self.policy = get(conditionOptions, 'policy') || 'available';
    return self;
  };

  VoipTimeConditionCondition.prototype.clone = function clone() {
    const self = this;
    const timeConditionOptions = angular.copy(self);
    delete timeConditionOptions.conditionId;

    return new VoipTimeConditionCondition(timeConditionOptions);
  };

  VoipTimeConditionCondition.prototype.getTimeMoment = function getTimeMoment(
    time,
  ) {
    const self = this;
    const timePath = time ? `time${upperFirst(time)}` : 'timeFrom';
    const splittedTime = get(self, timePath).split(':');
    return moment()
      .day(VOIP_TIMECONDITION_ORDERED_DAYS.indexOf(self.weekDay) + 1)
      .hour(splittedTime[0])
      .minute(splittedTime[1])
      .second(splittedTime[2]);
  };

  VoipTimeConditionCondition.prototype.toFullCalendarEvent = function toFullCalendarEvent() {
    const self = this;

    return {
      id: self.conditionId,
      start: self.getTimeMoment('from'),
      end: self.getTimeMoment('to'),
      allDay: false,
    };
  };

  /* ----------  API Calls  ----------*/

  VoipTimeConditionCondition.prototype.create = function create() {
    const self = this;

    const conditionResources = voipTimeCondition.getResource(
      'condition',
      self.featureType,
    );

    return conditionResources
      .create(
        voipTimeCondition.getConditionResourceCallParams(self, null),
        voipTimeCondition.getConditionResourceCallActionParams(self),
      )
      .$promise.then((conditionOptions) => {
        self.conditionId = get(
          conditionOptions,
          self.featureType === 'sip' ? 'id' : 'conditionId',
        );
        self.state = 'OK';
        return self;
      });
  };

  VoipTimeConditionCondition.prototype.save = function save() {
    const self = this;
    const conditionResources = voipTimeCondition.getResource(
      'condition',
      self.featureType,
    );

    return conditionResources.save(
      voipTimeCondition.getConditionResourceCallParams(self),
      voipTimeCondition.getConditionResourceCallActionParams(self),
    ).$promise;
  };

  VoipTimeConditionCondition.prototype.remove = function remove() {
    const self = this;
    const conditionResources = voipTimeCondition.getResource(
      'condition',
      self.featureType,
    );

    return conditionResources.remove(
      voipTimeCondition.getConditionResourceCallParams(self),
    ).$promise;
  };

  /* ----------  EDITION  ----------*/

  VoipTimeConditionCondition.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      weekDay: angular.copy(self.weekDay),
      timeFrom: angular.copy(self.timeFrom),
      timeTo: angular.copy(self.timeTo),
    };

    if (self.featureType !== 'ovhPabx') {
      self.saveForEdition.policy = angular.copy(self.policy);
    }

    if (!self.originalSave) {
      self.originalSave = angular.copy(self.saveForEdition);
    }

    return self;
  };

  VoipTimeConditionCondition.prototype.stopEdition = function stopEdition(
    cancel,
    cancelToOriginalSave,
    resetOriginalSave,
  ) {
    const self = this;
    let fromObject;

    if (self.originalSave && cancelToOriginalSave) {
      fromObject = self.originalSave;
    } else if (self.saveForEdition && cancel) {
      fromObject = self.saveForEdition;
    }

    if ((cancelToOriginalSave || cancel) && fromObject) {
      self.weekDay = angular.copy(get(fromObject, 'weekDay'));
      self.timeFrom = angular.copy(get(fromObject, 'timeFrom'));
      self.timeTo = angular.copy(get(fromObject, 'timeTo'));

      if (self.featureType !== 'ovhPabx') {
        self.policy = angular.copy(get(fromObject, 'policy'));
      }
    }

    if (cancelToOriginalSave || resetOriginalSave) {
      self.originalSave = null;
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  VoipTimeConditionCondition.prototype.hasChange = function hasChange(
    property,
    fromOriginal,
  ) {
    const self = this;
    let compareToObject = null;

    if (['DRAFT', 'TO_CREATE', 'TO_DELETE'].indexOf(self.state) > -1) {
      return true;
    }

    if (fromOriginal && !self.originalSave) {
      return false;
    }
    if (!fromOriginal && !self.saveForEdition) {
      return false;
    }

    compareToObject = fromOriginal ? self.originalSave : self.saveForEdition;

    if (property) {
      return !isEqual(get(self, property), get(compareToObject, property));
    }
    if (self.featureType !== 'ovhPabx') {
      return (
        self.hasChange('weekDay', fromOriginal) ||
        self.hasChange('timeFrom', fromOriginal) ||
        self.hasChange('timeTo', fromOriginal) ||
        self.hasChange('policy', fromOriginal)
      );
    }
    return (
      self.hasChange('weekDay', fromOriginal) ||
      self.hasChange('timeFrom', fromOriginal) ||
      self.hasChange('timeTo', fromOriginal)
    );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return VoipTimeConditionCondition;
};
