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

export default class DialplanExtensionEditCtrl {
  /* @ngInject */
  constructor($scope, $q, telephonyScheduler, voipTimeCondition) {
    this.$scope = $scope;
    this.$q = $q;
    this.telephonyScheduler = telephonyScheduler;
    this.voipTimeCondition = voipTimeCondition;

    this.voipTimeConditionOrderedDays = VOIP_TIMECONDITION_ORDERED_DAYS;

    this.loading = {
      init: false,
    };

    this.model = {
      callerIdNumber: null,
      hour: null,
    };

    this.parentCtrl = null;
    this.dialplan = null;
    this.extension = null;

    this.groupedTimeConditions = null;
    this.availableHours = null;

    this.schedulerCategories = null;
    this.screenListTypes = ['incomingBlackList', 'incomingWhiteList'];

    this.conditionMatched = null;

    this.loading.init = true;
  }

  $onInit() {
    // set parent ctrl
    this.parentCtrl = get(this.$scope, '$parent.$ctrl');

    // set dialplan and extension
    this.dialplan = this.parentCtrl.dialplan;
    this.extension = this.parentCtrl.extension.startEdition();

    // set options for time conditions
    this.groupedTimeConditions = map(
      this.voipTimeCondition.groupTimeConditions(this.extension.timeConditions),
      // turns out the scope of this gets lost if not bound
      this.transformVoipTimeConditionGroup.bind(this),
    );

    this.availableHours = DialplanExtensionEditCtrl.getDayQuarter();

    return this.telephonyScheduler
      .getAvailableCategories()
      .then((availableCategories) => {
        this.schedulerCategories = availableCategories;
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  $onDestroy() {
    if (this.extension && !this.parentCtrl.isLoading()) {
      this.extension.stopEdition(true);
    }
  }

  convertCategoryToSlot(category) {
    return this.telephonyScheduler.convertCategoryToSlot(null, category);
  }

  getScreenListConditionList() {
    return filter(
      this.extension.screenListConditions,
      (screenList) => screenList.state !== 'TO_DELETE',
    );
  }

  isConditionMatch(phoneNumber) {
    this.conditionMatched = find(
      this.getScreenListConditionList(),
      (condition) => startsWith(phoneNumber, condition.callNumber),
    );

    return !this.conditionMatched;
  }

  static orderConditionTimeByTimeFrom(slot) {
    return slot.condition.getTimeMoment().toDate();
  }

  static hourStartWith(curHour, viewValue) {
    return (
      startsWith(curHour.toString(), viewValue.toString()) ||
      startsWith(curHour.toString(), `0${viewValue.toString()}`)
    );
  }

  isConditionGroupValid(conditionGroup) {
    return (
      conditionGroup.days.length &&
      this.availableHours.indexOf(conditionGroup.slotTimeModel.timeFrom) !==
        -1 &&
      this.availableHours.indexOf(conditionGroup.slotTimeModel.timeTo) !== -1
    );
  }

  getTimeConditionList() {
    return filter(
      this.extension.timeConditions,
      (timeCondition) => timeCondition.state !== 'TO_DELETE',
    );
  }

  manageTimeConditionRemove(timeConditions) {
    timeConditions.forEach((timeCondition) => {
      if (timeCondition.state === 'DRAFT') {
        this.extension.removeTimeCondition(timeCondition);
      } else {
        set(timeCondition, 'state', 'TO_DELETE');
      }
    });
  }

  onConditionTypeBtnClick(conditionType) {
    this.parentCtrl.popoverStatus.move = true;
    this.parentCtrl.popoverStatus.rightPage = conditionType;
  }

  static getDayQuarter() {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const quarters = [];

    while (start.isBefore(end)) {
      quarters.push(start.format('HH:mm'));
      start.add(15, 'minutes');
    }

    return quarters;
  }

  static hasConditionCollision(timeConditions, timeFromParam, timeToParam) {
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

  /* ----------  TIME CONDITION  ----------*/

  onConditionGroupAddBtnClick() {
    const conditionGroup = this.transformVoipTimeConditionGroup(
      this.voipTimeCondition.createGroupCondition([], {}),
    );
    conditionGroup.collapsed = false;
    this.groupedTimeConditions.push(conditionGroup);
  }

  onDayBtnClick(day, conditionGroup) {
    let dayConditions = [];
    set(conditionGroup, 'errors.collision', false);

    if (day.selected) {
      if (conditionGroup.days.indexOf(day.value) > -1) {
        return false;
      }

      // before check if there is no collision
      const filteredConditions = filter(
        this.extension.timeConditions,
        (timeCondition) =>
          timeCondition.state !== 'TO_DELETE' &&
          day.value === timeCondition.weekDay,
      );
      const isCollisionDetected = some(conditionGroup.slots, (slot) =>
        DialplanExtensionEditCtrl.hasConditionCollision(
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
            this.extension.addTimeCondition(newConditionOptions),
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
      this.manageTimeConditionRemove(dayConditions);

      if (!conditionGroup.days.length) {
        set(conditionGroup, 'slots', []);
      }
    }

    return null;
  }

  onConditionAddBtnClick(conditionsGroup) {
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
        this.extension.timeConditions,
        (timeCondition) =>
          timeCondition.state !== 'TO_DELETE' && day === timeCondition.weekDay,
      );

      return DialplanExtensionEditCtrl.hasConditionCollision(
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
      const condition = this.extension.addTimeCondition({
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
  }

  onTimeConditionDeleteConfirmBtnClick(slot, conditionsGroup) {
    // first set slot conditions state to "to delete" or remove from extension time conditions list
    this.manageTimeConditionRemove(slot.conditions);

    // then remove slot
    remove(conditionsGroup.slots, slot);
  }

  transformVoipTimeConditionGroup(group) {
    const orderedDays = map(
      this.voipTimeConditionOrderedDays,
      (day, index) => ({
        value: day,
        label: moment()
          .set('day', index + 1)
          .format('dd'),
      }),
    );
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

  /* ----------  SCREENLIST  ----------*/

  onScreenListConditionAddBtnClick() {
    // add the condition
    this.extension.addScreenListCondition({
      callerIdNumber: this.model.callerIdNumber,
      screenListType: this.extension.screenListType,
      state: 'DRAFT',
    });

    // reset model
    this.model.callerIdNumber = null;
  }

  onCallerIdNumberAddKeyDown($event) {
    if (
      $event.key === 'Enter' &&
      this.addScreenListConditionForm.callerIdNumber.$valid
    ) {
      this.onScreenListConditionAddBtnClick();
      $event.preventDefault();
      return false;
    }
    return null;
  }

  onScreenListDeleteConfirmBtnClick(condition) {
    if (condition.state === 'DRAFT') {
      // if draft simply remove from list
      return this.extension.removeScreenListCondition(condition);
    }

    set(condition, 'state', 'TO_DELETE');
    return null;
  }

  /* ----------  FOOTER ACTIONS  ----------*/

  onValidateBtnClick() {
    this.parentCtrl.popoverStatus.isOpen = false;
    this.parentCtrl.popoverStatus.move = false;

    // remove all screen list conditions if no list type selected
    if (isNull(this.extension.screenListType)) {
      this.extension.screenListConditions.forEach((condition) => {
        if (condition.state !== 'DRAFT') {
          set(condition, 'state', 'TO_DELETE');
        } else {
          this.extension.removeScreenListCondition(condition);
        }
      });
    }

    return this.extension.save().then(() => {
      this.extension.stopEdition();
      return this.$q.allSettled([
        this.extension.saveScreenListConditions(),
        this.extension.saveTimeConditions(),
      ]);
    });
  }

  onCancelBtnClick() {
    this.parentCtrl.onCancelExtensionEdit();
  }
}
