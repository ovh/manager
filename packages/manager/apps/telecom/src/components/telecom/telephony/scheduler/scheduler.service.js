import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import { CATEGORY_TO_TIME_CONDITION_SLOT_TYPE } from './scheduler.constants';
import { VOIP_TIME_CONDITION_DEFAULT_SLOTS } from '../timeCondition/time-condition.constant';

export default /* @ngInject */ function telephonyScheduler(
  $q,
  $translate,
  TelephonyMediator,
) {
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
    return TelephonyMediator.getApiModelEnum('telephony.timeZone').then(
      (enumValues) => {
        timeZones = map(enumValues, (timeZone) => ({
          value: timeZone,
          label: $translate.instant(
            `telephony_scheduler_options_time_zone_${snakeCase(timeZone)}`,
          ),
        }));

        return timeZones;
      },
    );
  };

  /* ----------  CATEGORIES  ----------*/

  self.getAvailableCategories = function getAvailableCategories() {
    if (categories) {
      return $q.when(categories);
    }
    return TelephonyMediator.getApiModelEnum('telephony.SchedulerCategoryEnum');
  };

  self.convertCategoryToSlot = function convertCategoryToSlot(
    timeCondition,
    category,
  ) {
    const slots = timeCondition
      ? timeCondition.slots
      : VOIP_TIME_CONDITION_DEFAULT_SLOTS;

    return find(slots, {
      name: get(CATEGORY_TO_TIME_CONDITION_SLOT_TYPE, category),
    });
  };

  /* -----  End of API ENUMS  ------*/
}
