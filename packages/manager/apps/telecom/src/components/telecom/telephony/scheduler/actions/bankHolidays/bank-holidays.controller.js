import filter from 'lodash/filter';
import head from 'lodash/head';
import keys from 'lodash/keys';
import last from 'lodash/last';
import map from 'lodash/map';

export default /* @ngInject */ function TelephonySchedulerBankHolidaysCtrl(
  $translate,
  $uibModalInstance,
  modalData,
  TucBankHolidays,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.model = {
    country: null,
    year: moment().get('year'),
  };

  self.countryList = null;
  self.yearList = null;
  self.holidaysLists = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.refreshBankHolidaysList = function refreshBankHolidaysList() {
    self.holidaysLists = {};

    angular.forEach(self.yearList, (year) => {
      self.holidaysLists[year] = TucBankHolidays.getBankHolidays(
        self.model.country,
        year,
        modalData,
      );
    });
  };

  self.filterEvents = function filterEvents(year) {
    if (year) {
      return filter(
        self.holidaysLists[year],
        (bankHoliday) => bankHoliday.active && !bankHoliday.disabled,
      );
    }
    let bankHolidays = [];
    keys(self.holidaysLists).forEach((theYear) => {
      bankHolidays = bankHolidays.concat(self.filterEvents(theYear));
    });
    return bankHolidays;
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

  self.manageInject = function manageInject() {
    return self.close({
      newEvents: self.filterEvents(),
    });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function getCountryModel() {
    switch (modalData.scheduler.timeZone) {
      case 'Europe/Berlin':
        return 'DE';
      case 'Europe/Brussels':
        return 'BE';
      case 'Europe/London':
        return 'GB';
      case 'Europe/Madrid':
        return 'ES';
      case 'Europe/Paris':
        return 'FR';
      case 'Europe/Zurich':
        return 'CH';
      default:
        return 'FR';
    }
  }

  function init() {
    // build country list
    self.countryList = map(keys(TucBankHolidays.BANK_HOLIDAYS), (country) => ({
      value: country,
      label: $translate.instant(`country_${country}`),
    }));

    // build year list
    self.yearList = [
      self.model.year,
      moment()
        .add(1, 'year')
        .get('year'),
      moment()
        .add(2, 'year')
        .get('year'),
    ];

    // get default selected country depending to scheduler timezone
    self.model.country = getCountryModel();

    self.loading.init = true;

    return modalData.scheduler
      .getEvents({
        'dateStart.from': moment()
          .year(head(self.yearList))
          .startOf('year')
          .format(),
        'dateEnd.to': moment()
          .year(last(self.yearList))
          .endOf('year')
          .format(),
        categories: 'holidays',
      })
      .then(() => {
        // get the bank holidays dates
        self.refreshBankHolidaysList();
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
