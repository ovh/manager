import angular from 'angular';
import 'moment';
import padStart from 'lodash/padStart';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucBankHolidays
 *
 *  @description
 *  <p>This service allow the manager to retrieve bank holidays date for countries which are
 *    defined into BANK_HOLIDAYS constants table.</p>
 */
export default class {
  /* @ngInject */
  constructor(BANK_HOLIDAYS) {
    this.BANK_HOLIDAYS = BANK_HOLIDAYS;

    this.year = null;
    this.bankDayName = null;
    this.easterDay = null;
  }

  /**
   *  Get the Easter day according to https://www.irt.org/articles/js052/index.htm
   */
  getEaster() {
    const constant = Math.floor(this.year / 100);
    const next = this.year - 19 * Math.floor(this.year / 19);
    const key = Math.floor((constant - 17) / 25);
    let int =
      constant -
      Math.floor(constant / 4) -
      Math.floor((constant - key) / 3) +
      19 * next +
      15;
    int -= 30 * Math.floor(int / 30);
    int -=
      Math.floor(int / 28) *
      (1 -
        Math.floor(int / 28) *
          Math.floor(29 / (int + 1)) *
          Math.floor((21 - next) / 11));
    let valJ =
      this.year +
      Math.floor(this.year / 4) +
      int +
      2 -
      constant +
      Math.floor(constant / 4);
    valJ -= 7 * Math.floor(valJ / 7);
    const level = int - valJ;
    const month = 3 + Math.floor((level + 40) / 44);
    const day = level + 28 - 31 * Math.floor(month / 4);

    return [this.year, padStart(month, 2, '0'), padStart(day, 2, '0')].join(
      '-',
    );
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucBankHolidays#getSpecialBankHoliday
   *  @methodOf managerApp.service:tucBankHolidays
   *
   *  @description
   *  Retrieve special bank holiday from easter day.
   *
   *  @return date for special bank holiday
   */
  getSpecialBankHoliday() {
    switch (this.bankDayName) {
      case 'easter_monday':
        return moment(this.easterDay).add(1, 'day');
      case 'ascension_day':
        // ascension is 40 days after easter
        return moment(this.easterDay).add(39, 'day');
      case 'whit_monday':
        // whit sunday (Pentecost) is 50 days after easter
        return moment(this.easterDay).add(50, 'day');
      case 'good_friday':
        // friday before easter
        return moment(this.easterDay).subtract(2, 'day');
      case 'may_day':
        // The May Day bank holiday falls on the first Monday in May
        return moment()
          .year(this.year)
          .month(4)
          .startOf('month')
          .startOf('isoWeek');
      case 'spring_bank_holiday':
        // last monday in May
        return moment()
          .year(this.year)
          .month(4)
          .endOf('month')
          .startOf('isoWeek');
      case 'summer_bank_holiday':
        // last monday in August
        return moment()
          .year(this.year)
          .month(7)
          .endOf('month')
          .startOf('isoWeek');
      default:
        return null;
    }
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucBankHolidays#getHolidayDate
   *  @methodOf managerApp.service:tucBankHolidays
   *
   *  @description
   *  Get the bank holiday date
   *
   *  @param {Date} bankDay
   *  @param {Integer} year
   *
   *  @return bank holiday date
   */
  getHolidayDate(bankDay, year) {
    this.year = year;
    this.bankDayName = bankDay.name;

    this.easterDay = this.getEaster();
    const bankHolidayDate = bankDay.date
      ? moment([this.year, bankDay.date].join('-'))
      : this.getSpecialBankHoliday();
    return bankHolidayDate;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucBankHolidays#getBankHolidays
   *  @methodOf managerApp.service:tucBankHolidays
   *
   *  @description
   *  Retrieve the list of bank holidays for a country and a year,
   *  calculated on an interval (start and end dates into the modalData.schelduler)
   *
   *  @param {String} country
   *  @param {Integer} year
   *  @param {Object} modalData  this modal contains a scheduler with categories,
   *                             start and end dates
   *
   *  @return list of bank holidays
   */
  getBankHolidays(country, year, modalData) {
    const countryBankHolidays = this.BANK_HOLIDAYS[country];
    const holidaysList = [];

    angular.forEach(countryBankHolidays, (bankDay) => {
      const bankHolidayDate = this.getHolidayDate(bankDay, year);
      if (
        moment()
          .subtract(1, 'day')
          .isBefore(bankHolidayDate)
      ) {
        const isBankHolidayInEventRange = modalData.scheduler.isEventInExistingRange(
          {
            categories: 'holidays',
            dateStart: bankHolidayDate.toDate(),
            dateEnd: moment(bankHolidayDate)
              .endOf('day')
              .toDate(),
          },
        );
        holidaysList.push({
          name: bankDay.name,
          date: bankHolidayDate,
          active: true,
          disabled: isBankHolidayInEventRange,
        });
      }
    });
    return holidaysList;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucBankHolidays#checkIsBankHoliday
   *  @methodOf managerApp.service:tucBankHolidays
   *
   *  @description
   *  Check if the param date for a country is a bank holiday date.
   *
   *  @param {String} country
   *  @param {Date} dateToCheck
   *
   *  @return boolean
   */
  checkIsBankHoliday(country, dateToCheck) {
    const countryBankHolidays = this.BANK_HOLIDAYS[country];
    const year = dateToCheck.getFullYear();

    let isBankHoliday = false;
    angular.forEach(countryBankHolidays, (bankDay) => {
      const bankHolidayDate = this.getHolidayDate(bankDay, year);

      if (
        bankHolidayDate.format('YYYY-MM-DD') ===
        moment(dateToCheck).format('YYYY-MM-DD')
      ) {
        isBankHoliday = true;
      }
    });
    return isBankHoliday;
  }
}
