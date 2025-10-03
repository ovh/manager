export const name = 'iamConditionWeekdayService';

export default class IAMConditionWeekdayService {
  /* @ngInject */
  constructor(coreConfig) {
    this.userLocale = coreConfig.getUserLocale().replace('_', '-');
    const options = { weekday: 'long' }; // 'long' for full names
    this.userLocaleFormatter = new Intl.DateTimeFormat(
      this.userLocale,
      options,
    );
    this.intlFormatter = new Intl.DateTimeFormat('en-GB', options);
  }

  getWeekdays() {
    const date = new Date();
    const weekdays = [];

    for (let i = 1; i <= 7; i += 1) {
      date.setDate(i);
      weekdays.push({
        label: this.userLocaleFormatter.format(date),
        value: this.intlFormatter.format(date),
      });
    }

    return weekdays;
  }
}
