angular.module('managerApp').service('voipTimeCondition', function ($q, $translate, OvhApiTelephony, VOIP_TIME_CONDITION, VOIP_TIMECONDITION_ORDERED_DAYS) {
  const self = this;

  const timeConditionResources = {
    sip: {
      init: OvhApiTelephony.TimeCondition().v6().getOptions,
      save: OvhApiTelephony.TimeCondition().v6().setOptions,
      condition: OvhApiTelephony.TimeCondition().Condition().v6(),
    },
    easyHunting: {
      init: OvhApiTelephony.EasyHunting().TimeConditions().v6().get,
      save: OvhApiTelephony.EasyHunting().TimeConditions().v6().save,
      condition: OvhApiTelephony.EasyHunting().TimeConditions().Conditions().v6(),
    },
    ovhPabx: {
      condition: OvhApiTelephony.OvhPabx().Dialplan().Extension().ConditionTime()
        .v6(),
    },
  };

  /*= ====================================================
    =            HELPERS FOR PARSING SIP HOURS            =
    ===================================================== */

  self.getSipTime = function (time, isEnd) {
    const splittedTime = time.split(':');
    let hours = _.get(splittedTime, '[0]');
    let minutes = _.get(splittedTime, '[1]');
    if (isEnd) {
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (minutesInt === 59) {
        hours = _.padLeft(hoursInt + 1, 2, '0');
        minutes = '00';
      } else {
        minutes = _.padLeft(minutesInt + 1, 2, '0');
      }
    }

    return [hours, minutes].join('');
  };

  self.parseSipTime = function (timeStr, modulo) {
    let hour = timeStr.substring(0, 2);
    let minute = timeStr.substring(2);
    let second = modulo ? '59' : '00';

    if (modulo) {
      const minuteInt = parseInt(minute, 10);
      if (minuteInt === 0) {
        hour = _.padLeft(hour - 1, 2, '0');
        minute = '59';
        second = '59';
      } else if (minuteInt % 15 === 0) {
        minute = _.padLeft(minuteInt - 1, 2, '0');
        second = '59';
      }
    }

    return [hour, minute, second].join(':');
  };

  self.parseTime = function (timeStr) {
    const splittedTimeStr = timeStr.split(':');
    const hour = splittedTimeStr[0];
    const minute = splittedTimeStr[1];
    const second = splittedTimeStr[2];
    const minuteInt = parseInt(minute, 10);
    if (minuteInt % 15 === 0) {
      const timeMoment = moment().hour(hour).minute(minute).second(second);
      return timeMoment.startOf('minute').subtract(1, 'second').format('HH:mm:ss');
    }
    return timeStr;
  };

  /* -----  End of HELPERS FOR PARSING SIP HOURS  ------*/

  self.getAvailableSlotsCount = function (featureType) {
    return _.get(VOIP_TIME_CONDITION, `slotTypesCount.${featureType}`, 0);
  };

  self.getResource = function (resourceType, featureType) {
    return _.get(timeConditionResources, `${featureType}.${resourceType}`, {
      $promise: $q.when({}),
    });
  };

  self.getResourceCallParams = function (timeCondition) {
    const params = {
      billingAccount: timeCondition.billingAccount,
      serviceName: timeCondition.serviceName,
    };

    if (timeCondition.featureType === 'ovhPabx') {
      params.dialplanId = timeCondition.dialplanId;
      params.extensionId = timeCondition.extensionId;
    }

    return params;
  };

  self.getConditionResourceCallParams = function (conditionObject, conditionId) {
    const params = self.getResourceCallParams(conditionObject);

    if (conditionId !== null) {
      _.set(params, conditionObject.featureType === 'sip' ? 'id' : 'conditionId', conditionObject.conditionId || conditionId);
    }

    return params;
  };

  self.getResourceCallActionParams = function (timeCondition) {
    const actionParams = {};

    if (timeCondition.featureType === 'ovhPabx') {
      return {};
    }

    // set slot values
    _.filter(timeCondition.slots, slot => slot.name !== 'available' && !_.isEmpty(slot.number)).forEach((slot) => {
      _.set(actionParams, `${slot.name}Type`, slot.type);
      _.set(actionParams, `${slot.name}Number`, slot.number);
    });

    if (timeCondition.featureType === 'sip') {
      _.set(actionParams, 'status', timeCondition.enable ? 'enabled' : 'disabled');
      _.set(actionParams, 'timeout', timeCondition.timeout);
    } else {
      _.set(actionParams, 'enable', timeCondition.enable);
    }

    return actionParams;
  };

  self.getConditionResourceCallActionParams = function (condition) {
    const actionParams = {};

    // set timeFrom => hourEnd for sip
    _.set(actionParams, condition.featureType === 'sip' ? 'hourBegin' : 'timeFrom', condition.featureType === 'sip' ? self.getSipTime(condition.timeFrom) : condition.timeFrom);

    // set timeTo => hourBegin for sip
    _.set(actionParams, condition.featureType === 'sip' ? 'hourEnd' : 'timeTo', condition.featureType === 'sip' ? self.getSipTime(condition.timeTo, true) : condition.timeTo);

    // set weekDay => day for sip
    _.set(actionParams, condition.featureType === 'sip' ? 'day' : 'weekDay', condition.weekDay);

    // set policy if not ovhPabx
    if (condition.featureType !== 'ovhPabx') {
      _.set(actionParams, 'policy', condition.policy);
    }

    return actionParams;
  };

  /*= ===========================================
    =            GROUP TIMECONDITIONS            =
    ============================================ */

  self.createGroupCondition = function (days, groupedConditionSlots) {
    return {
      days,
      slots: !groupedConditionSlots || _.isEmpty(groupedConditionSlots)
        ? [] : Object.keys(groupedConditionSlots).map((slotKey) => {
          const slotConditions = groupedConditionSlots[slotKey];
          return {
            condition: slotConditions[0].clone(),
            conditions: slotConditions,
          };
        }),
      getDisplayedText() {
        let followingIndex = false;
        let groupText;

        // get ordered days indexes
        const daysIndex = _.map(
          this.days,
          day => VOIP_TIMECONDITION_ORDERED_DAYS.indexOf(day),
        ).sort();

        // check if indexes follow each others
        if (daysIndex.length > 1) {
          followingIndex = _.every(daysIndex, (dayIndex, arrayIndex) => {
            if (arrayIndex === 0) {
              return true;
            }
            return dayIndex === daysIndex[arrayIndex - 1] + 1;
          });
        }

        // build text to display
        // first build day display
        if (followingIndex) {
          // first day
          const firstDayIndex = _.first(daysIndex);
          const firstDay = moment().weekday(firstDayIndex).format('dd');

          // last day
          const lastDayIndex = _.last(daysIndex);
          const lastDay = moment().weekday(lastDayIndex).format('dd');
          groupText = [firstDay, lastDay].join(' - ');
        } else {
          groupText = _.map(daysIndex, dayIndex => moment().weekday(dayIndex).format('dd')).join(', ');
        }

        // then build hours slots
        groupText += ' : ';
        const sortedSlots = _.chain(this.slots)
          .filter(slot => slot.condition)
          .sortByOrder(slot => slot.condition.getTimeMoment().toDate())
          .value();
        groupText += _.map(sortedSlots, slot => [
          $translate.instant('telephony_common_time_condition_slot_from'),
          slot.condition.getTimeMoment('from').format('HH:mm'),
          $translate.instant('telephony_common_time_condition_slot_to'),
          slot.condition.getTimeMoment('to').add(1, 'second').format('HH:mm'),
        ].join(' ')).join(', ');

        return groupText;
      },
    };
  };

  function groupConditionsByTimes(conditions) {
    const tmpCdts = {};

    conditions.forEach((timeCondition) => {
      const group = JSON.stringify([timeCondition.timeFrom, timeCondition.timeTo]);
      tmpCdts[group] = tmpCdts[group] || [];
      tmpCdts[group].push(timeCondition);
    });

    return Object.keys(tmpCdts).map(group => tmpCdts[group]);
  }

  /**
     *  Group same conditions per days. No check at policy for the moment
     */
  self.groupTimeConditions = function (conditions) {
    const tmpGroups = {};

    // first group conditions by time from and time to
    const groupedConditions = groupConditionsByTimes(conditions);

    // then group the grouped conditions with the same day
    groupedConditions.forEach((group) => {
      const groupKey = JSON.stringify(_.map(group, 'weekDay').sort());
      tmpGroups[groupKey] = tmpGroups[groupKey] || [];
      tmpGroups[groupKey] = tmpGroups[groupKey].concat(group);
    });

    // finally regroup the grouped conditions by time from and time to
    return Object.keys(tmpGroups).map((groupKey) => {
      const tmpGroup = tmpGroups[groupKey];

      // create the final groups - a group contains : the days and the hours slots
      return self.createGroupCondition(_.chain(tmpGroup).map('weekDay').uniq().value(), groupConditionsByTimes(tmpGroup));
    });
  };

  /* -----  End of GROUP TIMECONDITIONS  ------*/
});
