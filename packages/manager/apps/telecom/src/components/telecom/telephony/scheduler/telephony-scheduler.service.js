import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

angular.module('managerApp').service('telephonyScheduler', function telephonyScheduler($q, $translate, TelephonyMediator, SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE, VOIP_TIME_CONDITION_DEFAULT_SLOTS) {
  const self = this;

  let timeZones = null;
  const categories = null;

  /*= ================================
    =            API ENUMS            =
    ================================= */

  /* ----------  TIMEZONE  ----------*/

  self.getAvailableTimeZones = function getAvailableTimeZones() {
    if (timeZones) {
      return $q.when(timeZones);
    }
    return TelephonyMediator.getApiModelEnum('telephony.timeZone').then((enumValues) => {
      timeZones = map(enumValues, (timeZone) => ({
        value: timeZone,
        label: $translate.instant(`telephony_scheduler_options_time_zone_${snakeCase(timeZone)}`),
      }));

      return timeZones;
    });
  };

  /* ----------  CATEGORIES  ----------*/

  self.getAvailableCategories = function getAvailableCategories() {
    if (categories) {
      return $q.when(categories);
    }
    return TelephonyMediator.getApiModelEnum('telephony.SchedulerCategoryEnum');
  };

  self.convertCategoryToSlot = function convertCategoryToSlot(timeCondition, category) {
    const slots = timeCondition ? timeCondition.slots : VOIP_TIME_CONDITION_DEFAULT_SLOTS;

    return find(slots, {
      name: get(SCHEDULER_CATEGORY_TO_TIME_CONDITION_SLOT_TYPE, category),
    });
  };

  /* -----  End of API ENUMS  ------*/
});
