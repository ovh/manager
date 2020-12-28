import filter from 'lodash/filter';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import remove from 'lodash/remove';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import startsWith from 'lodash/startsWith';

export default /* @ngInject */ function voipTimeConditionConditionCtrl(
  $scope,
  $timeout,
  $translate,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.popoverStatus = {
    move: false,
    rightPage: null,
  };

  self.model = {
    timeFrom: null,
    timeTo: null,
  };

  self.repeatToDays = [];
  self.repeaterChoices = [
    {
      name: 'monday',
      id: 0,
      order: 0,
      active: false,
    },
    {
      name: 'tuesday',
      id: 1,
      order: 1,
      active: false,
    },
    {
      name: 'wednesday',
      id: 2,
      order: 2,
      active: false,
    },
    {
      name: 'thursday',
      id: 3,
      order: 3,
      active: false,
    },
    {
      name: 'friday',
      id: 4,
      order: 4,
      active: false,
    },
    {
      name: 'saturday',
      id: 5,
      order: 5,
      active: false,
    },
    {
      name: 'sunday',
      id: 6,
      order: 6,
      active: false,
    },
    {
      name: 'weekDays',
      id: 7,
      order: 7,
      active: false,
    },
    {
      name: 'weekendDays',
      id: 8,
      order: 8,
      active: false,
    },
  ];

  // From directive
  self.timeCondition = null;
  self.condition = null;
  self.fcEvent = null;

  // For controller
  self.maxFrom = null;
  self.activeSlot = null;
  self.overlapDetected = false;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function getActiveSlot() {
    return find(self.timeCondition.slots, {
      name: self.condition.policy,
    });
  }

  function refreshTime() {
    self.condition.timeFrom = moment(self.model.timeFrom, 'HH:mm').format(
      'HH:mm:ss',
    );
    self.condition.timeTo = moment(self.model.timeTo, 'HH:mm')
      .subtract(1, 'second')
      .format('HH:mm:ss');
  }

  self.isConditionValid = function isConditionValid() {
    // reset overlap status
    self.overlapDetected = false;

    // check if overlap an other condition on the same day
    const dayConditions = filter(
      self.timeCondition.conditions,
      (condition) =>
        condition.weekDay === self.condition.weekDay &&
        condition.conditionId !== self.condition.conditionId,
    );

    const isConditionOverlap = some(dayConditions, (condition) => {
      const momentFrom = condition.getTimeMoment('from');
      const momentTo = condition.getTimeMoment('to');

      return (
        (moment(self.model.timeFrom).isBetween(momentFrom, momentTo) ||
          moment(self.model.timeTo)
            .subtract(1, 'second')
            .isBetween(momentFrom, momentTo)) &&
        condition.state !== 'TO_DELETE'
      );
    });
    if (isConditionOverlap) {
      self.overlapDetected = true;
      return false;
    }

    return true;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onRepeaterBtnClick = function onRepeaterBtnClick() {
    self.popoverStatus.move = true;
    self.popoverStatus.rightPage = 'repeater';
  };

  function handleDay(dayActive, day) {
    if (dayActive) {
      self.repeatToDays.push(day);
    } else {
      remove(self.repeatToDays, { name: day.name });
    }
  }

  function handleDayList(dayActive, daySource) {
    if (daySource.id === 7) {
      self.repeaterChoices
        .filter(({ id }) => id < 5)
        .forEach((dayToRepeat) => {
          const day = dayToRepeat;
          day.active = dayActive;
        });
    } else {
      self.repeaterChoices
        .filter(({ id }) => [5, 6].includes(id))
        .forEach((dayToRepeat) => {
          const day = dayToRepeat;
          day.active = dayActive;
        });
    }

    self.repeatToDays = angular.copy(self.repeaterChoices);
  }

  self.updateRepeaterChoices = function updateRepeaterChoices(dayActive, day) {
    if (day.id < 7) {
      handleDay(dayActive, day);
    } else {
      handleDayList(dayActive, day);
    }

    self.repeatToDays = sortBy(self.repeatToDays, 'id');
  };

  self.moveBackward = function moveBackward() {
    const choices = self.repeatToDays
      .filter(({ active, id }) => active && ![7, 8].includes(id))
      .map(({ id }) => id);
    const weekDays = [0, 1, 2, 3, 4];
    const weekendDays = [5, 6];

    if (isEqual(choices, weekDays)) {
      self.repeatToDaysLabel = $translate.instant(
        'voip_time_condition_condition_popover_days_repeat_weekDays_label',
      );
    } else if (isEqual(weekendDays, choices)) {
      self.repeatToDaysLabel = $translate.instant(
        'voip_time_condition_condition_popover_days_repeat_weekendDays_label',
      );
    } else if (isEqual(weekDays.concat(weekendDays), choices)) {
      self.repeatToDaysLabel = $translate.instant(
        'voip_time_condition_condition_popover_days_repeat_allDays_label',
      );
    } else {
      self.repeatToDaysLabel = self.repeatToDays
        .filter(({ active, id }) => active && ![7, 8].includes(id))
        .map(({ name }) =>
          $translate.instant(
            `voip_time_condition_condition_popover_days_${name} `,
          ),
        )
        .join(' ');
    }
    self.popoverStatus.move = false;
  };

  /* ----------  Policy  ----------*/

  self.onPolicyBtnClick = function onPolicyBtnClick() {
    self.popoverStatus.move = true;
    self.popoverStatus.rightPage = 'policy';
  };

  self.onSlotTypeChange = function onSlotTypeChange() {
    self.popoverStatus.move = false;
    self.activeSlot = getActiveSlot();
  };

  /* ----------  TimeFrom and TimeTo  ----------*/
  self.onTimeChange = function onTimeChange(modelValue, timeAttr) {
    self.model[timeAttr] = modelValue;
    const timeToMoment = moment(self.model.timeTo, 'HH:mm');
    const isEndMidnight =
      timeToMoment.get('hour') === 0 && timeToMoment.get('minute') === 0;
    if (
      !isEndMidnight &&
      moment(self.model.timeFrom, 'HH:mm').isSameOrAfter(
        moment(self.model.timeTo, 'HH:mm'),
      )
    ) {
      self.model.timeTo = moment(self.model.timeFrom, 'HH:mm')
        .add(15, 'minute')
        .toDate();
    }
    refreshTime();
  };

  self.onTimeFromChange = function onTimeFromChange(modelValue) {
    self.onTimeChange(modelValue, 'timeFrom');
  };

  self.onTimeToChange = function onTimeToChange(modelValue) {
    self.onTimeChange(modelValue, 'timeTo');
  };

  /* ----------  Delete condition  ----------*/

  self.onDeleteConfirmBtnClick = function onDeleteConfirmBtnClick() {
    if (startsWith(self.condition.conditionId, 'tmp_')) {
      self.timeCondition.removeCondition(self.condition);
    } else {
      self.condition.state = 'TO_DELETE';
    }
    self.$onDestroy();
  };

  /* ----------  Footer actions  ----------*/

  self.onValidateBtnClick = function onValidateBtnClick() {
    /* Timeout is because of oui-timepicker buggy behavior, the on-change event
     * is not triggered and the model value is not updated unless you tab out or click
     * on another element. Clicking on submit button after editing the oui-timepicker
     * will result in an incorrect model value, adding some delay temporarily fix
     * the issue. @TODO remove when oui-timepicker is fixed
     */
    $timeout(() => {
      let repeatToDays = [];
      if (self.condition.state === 'DRAFT') {
        self.condition.state = 'TO_CREATE';
      }

      self.condition.stopEdition();
      repeatToDays = self.repeatToDays.filter(
        ({ id, active }) => active && ![7, 8].includes(id),
      );

      if ($scope.$parent.$ctrl.onPopoverValidate) {
        $scope.$parent.$ctrl.onPopoverValidate(
          self.fcEvent,
          repeatToDays,
          self,
        );
      }
    }, 500);
  };

  self.onCancelBtnClick = function onCancelBtnClick() {
    self.$onDestroy();
  };

  self.onDeleteBtnClick = function onDeleteBtnClick() {
    self.popoverStatus.move = true;
    self.popoverStatus.rightPage = 'delete';
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return $timeout(angular.noop, 99)
      .then(() => {
        // set time condition instance from parent controller
        self.timeCondition = $scope.$parent.$ctrl.timeCondition;

        // set full calendar event from parent controller
        self.fcEvent = $scope.$parent.$ctrl.fcEventInEdition;

        // set currently edited condition instance from parent controller
        self.condition = $scope.$parent.$ctrl.conditionInEdition;

        // stop fc event edition - to avoid drag/drop and resize
        // self.fcEvent.editable = false;
        // set models
        // set time models
        self.model.timeFrom = self.condition.getTimeMoment('from').toDate();
        self.model.timeTo = self.condition
          .getTimeMoment('to')
          .add(1, 'second')
          .toDate();

        // set active condition slot
        self.activeSlot = getActiveSlot();

        // some helper
        self.maxFrom = moment(self.model.timeFrom)
          .endOf('day')
          .subtract({
            minute: 15,
          })
          .toDate();

        // call on popover init function if exist in parent ctrl
        if (isFunction($scope.$parent.$ctrl.onPopoverInit)) {
          $scope.$parent.$ctrl.onPopoverInit();
        }
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  self.$onDestroy = function $onDestroy() {
    if (self.condition.state === 'DRAFT') {
      self.timeCondition.removeCondition(self.condition);
    } else {
      self.condition.stopEdition(true);
    }

    if (isFunction($scope.$parent.$ctrl.onPopoverDestroy)) {
      $scope.$parent.$ctrl.onPopoverDestroy(self.fcEvent);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
