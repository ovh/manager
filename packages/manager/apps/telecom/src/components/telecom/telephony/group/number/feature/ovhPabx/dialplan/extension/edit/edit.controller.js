import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';

import { VOIP_TIMECONDITION_ORDERED_DAYS } from '../../../../../../../timeCondition/time-condition.constant';

export default /* @ngInject */ function telephonyNumberOvhPabxDialplanExtensionEditCtrl(
  $scope,
  $q,
  telephonyScheduler,
  voipTimeCondition,
) {
  const self = this;
  const orderedDays = map(VOIP_TIMECONDITION_ORDERED_DAYS, (day, index) => ({
    value: day,
    label: moment()
      .set('day', index + 1)
      .format('dd'),
  }));

  self.loading = {
    init: false,
  };

  self.model = {
    callerIdNumber: null,
    hour: null,
  };

  self.parentCtrl = null;
  self.dialplan = null;
  self.extension = null;

  self.groupedTimeConditions = null;
  self.availableHours = null;

  self.schedulerCategories = null;
  self.screenListTypes = ['incomingBlackList', 'incomingWhiteList'];

  self.conditionMatched = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function getDayQuarter() {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const quarters = [];

    while (start.isBefore(end)) {
      quarters.push(start.format('HH:mm'));
      start.add(15, 'minutes');
    }

    return quarters;
  }

  function transformVoipTimeConditionGroup(group) {
    // set day model
    set(
      group,
      'dayModel',
      map(angular.copy(orderedDays), (day) => {
        set(day, 'selected', group.days.indexOf(day.value) !== -1);
        return day;
      }),
    );

    // set new slot time models
    set(group, 'slotTimeModel', {
      timeFrom: null,
      timeTo: null,
    });

    // set errors object
    set(group, 'errors', {
      timeFrom: false,
      timeTo: false,
      collision: false,
      badSlot: false,
    });

    // set collapsed state
    set(group, 'collapsed', true);
    return group;
  }

  self.convertCategoryToSlot = function convertCategoryToSlot(category) {
    return telephonyScheduler.convertCategoryToSlot(null, category);
  };

  self.getScreenListConditionList = function getScreenListConditionList() {
    return filter(
      self.extension.screenListConditions,
      (screenList) => screenList.state !== 'TO_DELETE',
    );
  };

  self.isConditionMatch = function isConditionMatch(phoneNumber) {
    self.conditionMatched = find(
      self.getScreenListConditionList(),
      (condition) => startsWith(phoneNumber, condition.callNumber),
    );

    return !self.conditionMatched;
  };

  self.orderConditionTimeByTimeFrom = function orderConditionTimeByTimeFrom(
    slot,
  ) {
    return slot.condition.getTimeMoment().toDate();
  };

  /* ----------  TIME CONDITIONS  ----------*/

  self.hourStartWith = function hourStartWith(curHour, viewValue) {
    return (
      startsWith(curHour.toString(), viewValue.toString()) ||
      startsWith(curHour.toString(), `0${viewValue.toString()}`)
    );
  };

  self.isConditionGroupValid = function isConditionGroupValid(conditionGroup) {
    return (
      conditionGroup.days.length &&
      self.availableHours.indexOf(conditionGroup.slotTimeModel.timeFrom) !==
        -1 &&
      self.availableHours.indexOf(conditionGroup.slotTimeModel.timeTo) !== -1
    );
  };

  self.getTimeConditionList = function getTimeConditionList() {
    return filter(
      self.extension.timeConditions,
      (timeCondition) => timeCondition.state !== 'TO_DELETE',
    );
  };

  function manageTimeConditionRemove(timeConditions) {
    timeConditions.forEach((timeCondition) => {
      if (timeCondition.state === 'DRAFT') {
        self.extension.removeTimeCondition(timeCondition);
      } else {
        set(timeCondition, 'state', 'TO_DELETE');
      }
    });
  }

  function hasConditionCollision(timeConditions, timeFromParam, timeToParam) {
    let timeFrom = timeFromParam;
    let timeTo = timeToParam;
    return some(timeConditions, (timeCondition) => {
      const momentFrom = timeCondition.getTimeMoment('from');
      if (!moment.isMoment(timeFrom)) {
        const splittedModelFrom = timeFrom.split(':');
        timeFrom = moment(momentFrom)
          .hour(splittedModelFrom[0])
          .minute(splittedModelFrom[1]);
      }
      const momentTo = timeCondition.getTimeMoment('to');
      if (!moment.isMoment(timeTo)) {
        const splittedModelTo = timeTo.split(':');
        timeTo = moment(momentTo)
          .hour(splittedModelTo[0])
          .minute(splittedModelTo[1]);
      }
      return (
        timeFrom.isBetween(momentFrom, momentTo, null, '[]') ||
        timeTo.isBetween(momentFrom, momentTo, null, '[]') ||
        momentFrom.isBetween(timeFrom, timeTo, null, '[]') ||
        momentTo.isBetween(timeFrom, timeTo, null, '[]')
      );
    });
  }

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  /* ----------  CONDITION TYPE  ----------*/

  self.onConditionTypeBtnClick = function onConditionTypeBtnClick(
    conditionType,
  ) {
    self.parentCtrl.popoverStatus.move = true;
    self.parentCtrl.popoverStatus.rightPage = conditionType;
  };

  /* ----------  TIME CONDITION  ----------*/

  self.onConditionGroupAddBtnClick = function onConditionGroupAddBtnClick() {
    const conditionGroup = transformVoipTimeConditionGroup(
      voipTimeCondition.createGroupCondition([], {}),
    );
    conditionGroup.collapsed = false;
    self.groupedTimeConditions.push(conditionGroup);
  };

  self.onDayBtnClick = function onDayBtnClick(day, conditionGroup) {
    let dayConditions = [];
    set(conditionGroup, 'errors.collision', false);

    if (day.selected) {
      if (conditionGroup.days.indexOf(day.value) > -1) {
        return false;
      }

      // before check if there is no collision
      const filteredConditions = filter(
        self.extension.timeConditions,
        (timeCondition) =>
          timeCondition.state !== 'TO_DELETE' &&
          day.value === timeCondition.weekDay,
      );
      const isCollisionDetected = some(conditionGroup.slots, (slot) =>
        hasConditionCollision(
          filteredConditions,
          slot.condition.timeFrom,
          slot.condition.timeTo,
        ),
      );

      if (isCollisionDetected) {
        set(conditionGroup, 'errors.collision', true);
        set(day, 'selected', false);
        return false;
      }

      // add day to group list
      conditionGroup.days.push(day.value);

      // add day conditions to group slots
      // if conditions exists - change their state
      conditionGroup.slots.forEach((slot) => {
        dayConditions = dayConditions.concat(
          filter(slot.conditions, {
            weekDay: day.value,
          }),
        );
      });

      if (dayConditions.length) {
        // set states to 'OK'
        dayConditions.forEach((timeCondition) => {
          set(timeCondition, 'state', 'OK');
        });
      } else {
        conditionGroup.slots.forEach((slot) => {
          const newConditionOptions = angular.copy(slot.condition);
          newConditionOptions.state = 'DRAFT';
          newConditionOptions.weekDay = day.value;
          delete newConditionOptions.conditionId;
          slot.conditions.push(
            self.extension.addTimeCondition(newConditionOptions),
          );
        });
      }
    } else {
      // remove day from group list
      remove(conditionGroup.days, (curDay) => curDay === day.value);

      // remove conditions from slots
      // get conditions of given day
      conditionGroup.slots.forEach((slot) => {
        dayConditions = dayConditions.concat(
          filter(slot.conditions, {
            weekDay: day.value,
          }),
        );
      });

      // manage condition states
      manageTimeConditionRemove(dayConditions);

      if (!conditionGroup.days.length) {
        set(conditionGroup, 'slots', []);
      }
    }

    return null;
  };

  self.onConditionAddBtnClick = function onConditionAddBtnClick(
    conditionsGroup,
  ) {
    set(conditionsGroup, 'errors.badSlot', false);
    set(conditionsGroup, 'errors.collision', false);

    // check if slot end is bigger than begin
    const curDate = moment().format('YYYY-MM-DD');
    const endHourMoment =
      conditionsGroup.slotTimeModel.timeTo === '00:00'
        ? moment().endOf('day')
        : moment(`${curDate} ${conditionsGroup.slotTimeModel.timeTo}`);
    if (
      !moment(`${curDate} ${conditionsGroup.slotTimeModel.timeFrom}`).isBefore(
        endHourMoment,
      )
    ) {
      set(conditionsGroup, 'errors.badSlot', true);
      return false;
    }

    // check for collision
    const isCollisionDetected = some(conditionsGroup.days, (day) => {
      // check if a condition overlap an other condition on the same day
      const filteredConditions = filter(
        self.extension.timeConditions,
        (timeCondition) =>
          timeCondition.state !== 'TO_DELETE' && day === timeCondition.weekDay,
      );

      return hasConditionCollision(
        filteredConditions,
        conditionsGroup.slotTimeModel.timeFrom,
        conditionsGroup.slotTimeModel.timeTo,
      );
    });

    if (isCollisionDetected) {
      set(conditionsGroup, 'errors.collision', true);
      return false;
    }

    const slotConditions = [];

    // create time conditions object
    conditionsGroup.days.forEach((day) => {
      const condition = self.extension.addTimeCondition({
        state: 'DRAFT',
        timeFrom: `${conditionsGroup.slotTimeModel.timeFrom}:00`,
        timeTo: `${conditionsGroup.slotTimeModel.timeTo}:00`,
        weekDay: day,
      });

      slotConditions.push(condition);
    });

    // add a new slot to group
    conditionsGroup.slots.push({
      condition: slotConditions[0].clone(),
      conditions: slotConditions,
    });

    // reset time models
    set(conditionsGroup, 'slotTimeModel.timeFrom', null);
    set(conditionsGroup, 'slotTimeModel.timeTo', null);

    return null;
  };

  self.onTimeConditionDeleteConfirmBtnClick = function onTimeConditionDeleteConfirmBtnClick(
    slot,
    conditionsGroup,
  ) {
    // first set slot conditions state to "to delete" or remove from extension time conditions list
    manageTimeConditionRemove(slot.conditions);

    // then remove slot
    remove(conditionsGroup.slots, slot);
  };

  /* ----------  SCREENLIST  ----------*/

  self.onScreenListConditionAddBtnClick = function onScreenListConditionAddBtnClick() {
    // add the condition
    self.extension.addScreenListCondition({
      callerIdNumber: self.model.callerIdNumber,
      screenListType: self.extension.screenListType,
      state: 'DRAFT',
    });

    // reset model
    self.model.callerIdNumber = null;
  };

  self.onCallerIdNumberAddKeyDown = function onCallerIdNumberAddKeyDown(
    $event,
  ) {
    if (
      $event.key === 'Enter' &&
      self.addScreenListConditionForm.callerIdNumber.$valid
    ) {
      self.onScreenListConditionAddBtnClick();
      $event.preventDefault();
      return false;
    }
    return null;
  };

  self.onScreenListDeleteConfirmBtnClick = function onScreenListDeleteConfirmBtnClick(
    condition,
  ) {
    if (condition.state === 'DRAFT') {
      // if draft simply remove from list
      return self.extension.removeScreenListCondition(condition);
    }

    set(condition, 'state', 'TO_DELETE');
    return null;
  };

  /* ----------  FOOTER ACTIONS  ----------*/

  self.onValidateBtnClick = function onValidateBtnClick() {
    self.parentCtrl.popoverStatus.isOpen = false;

    // remove all screen list conditions if no list type selected
    if (isNull(self.extension.screenListType)) {
      self.extension.screenListConditions.forEach((condition) => {
        if (condition.state !== 'DRAFT') {
          set(condition, 'state', 'TO_DELETE');
        } else {
          self.extension.removeScreenListCondition(condition);
        }
      });
    }

    return self.extension
      .save()
      .then(() => {
        self.extension.stopEdition();
        return $q.allSettled([
          self.extension.saveScreenListConditions(),
          self.extension.saveTimeConditions(),
        ]);
      })
      .finally(() => {
        self.parentCtrl.numberCtrl.jsplumbInstance.customRepaint();
      });
  };

  self.onCancelBtnClick = function onCancelBtnClick() {
    self.parentCtrl.popoverStatus.isOpen = false;
    self.parentCtrl.popoverStatus.move = false;

    self.extension.stopEdition(true);
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    // set parent ctrl
    self.parentCtrl = get($scope, '$parent.$ctrl');

    // set dialplan and extension
    self.dialplan = self.parentCtrl.dialplan;
    self.extension = self.parentCtrl.extension.startEdition();

    // set options for time conditions
    self.groupedTimeConditions = map(
      voipTimeCondition.groupTimeConditions(self.extension.timeConditions),
      transformVoipTimeConditionGroup,
    );
    self.availableHours = getDayQuarter();

    return telephonyScheduler
      .getAvailableCategories()
      .then((availableCategories) => {
        self.schedulerCategories = availableCategories;
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  self.$onDestroy = function $onDestroy() {
    if (self.extension && !self.parentCtrl.isLoading()) {
      self.extension.stopEdition(true);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
