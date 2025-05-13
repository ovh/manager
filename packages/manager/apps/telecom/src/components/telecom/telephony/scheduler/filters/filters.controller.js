import chunk from 'lodash/chunk';
import defaults from 'lodash/defaults';
import filter from 'lodash/filter';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelephonySchedulerFiltersCtrl(
  telephonyScheduler,
) {
  const self = this;
  let categories = null;

  self.loading = {
    init: true,
  };

  self.chunkedCategories = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.convertCategoryToSlot = function convertCategoryToSlot(category) {
    return telephonyScheduler.convertCategoryToSlot(
      self.telephonySchedulerCtrl.timeCondition,
      category,
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.toggleCategoryDisplay = function toggleCategoryDisplay(category) {
    set(category, 'active', !category.active);

    self.filters.categories = map(
      filter(categories, { active: false }),
      'value',
    );

    self.onChange();
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function onInit() {
    self.loading.init = true;
    self.telephonySchedulerCtrl.loading.filters = true;

    // check params
    self.filters = defaults(self.filters || {}, {
      categories: [], // will contain all categories to hide
    });

    return telephonyScheduler
      .getAvailableCategories()
      .then((apiCategories) => {
        categories = map(
          filter(apiCategories, (category) =>
            self.telephonySchedulerCtrl.timeCondition
              ? self.convertCategoryToSlot(category)
              : true,
          ),
          (category) => ({
            value: category,
            active: true,
          }),
        );

        self.chunkedCategories = chunk(categories, 2);
      })
      .finally(() => {
        self.loading.init = false;
        self.telephonySchedulerCtrl.loading.filters = false;
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
