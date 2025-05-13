import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

import { CATEGORY_TO_TIME_CONDITION_SLOT_TYPE } from '../../scheduler.constants';

export default /* @ngInject */ function TelephonySchedulerExportCtrl(
  $timeout,
  $uibModalInstance,
  modalData,
  telephonyScheduler,
) {
  const self = this;
  let categories = null;

  self.loading = {
    init: false,
    export: false,
  };

  self.status = {
    exported: false,
  };

  self.scheduler = null;
  self.timeCondition = null;
  self.filters = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.convertCategoryToSlot = function convertCategoryToSlot(category) {
    return find(self.timeCondition.slots, {
      name: get(CATEGORY_TO_TIME_CONDITION_SLOT_TYPE, category),
    });
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close(datas) {
    return $uibModalInstance.close(datas);
  };

  self.startExport = function startExport() {
    self.loading.export = true;

    return self.scheduler
      .getEvents()
      .then(
        () => {
          const fileName = `${[
            self.scheduler.billingAccount,
            self.scheduler.serviceName,
            'export',
          ].join('_')}.ics`;
          const filters = map(filter(categories, { active: false }), 'value');
          const blob = new Blob([self.scheduler.exportToIcs(filters)], {
            type: 'text/calendar;charset=utf-8;',
          });

          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, fileName);
          } else {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
            downloadLink.setAttribute('download', fileName);
            downloadLink.setAttribute('target', '_blank');
            downloadLink.setAttribute('style', 'visibility:hidden');

            document.body.appendChild(downloadLink);
            $timeout(() => {
              downloadLink.click();
              document.body.removeChild(downloadLink);
            });
          }

          self.status.exported = true;

          return $timeout(() => {
            self.close();
          }, 1000);
        },
        (error) => self.cancel(error),
      )
      .finally(() => {
        self.loading.export = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    self.scheduler = modalData.scheduler;
    self.timeCondition = modalData.timeCondition;
    self.filters = modalData.filters;

    return telephonyScheduler
      .getAvailableCategories()
      .then((apiCategories) => {
        categories = map(
          filter(apiCategories, (category) =>
            self.timeCondition ? self.convertCategoryToSlot(category) : true,
          ),
          (category) => ({
            value: category,
            active: self.filters.indexOf(category) === -1,
          }),
        );

        self.chunkedCategories = chunk(categories, 2);
      })
      .finally(() => {
        self.loading.init = false;
      })
      .catch((error) => {
        self.cancel(error);
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
