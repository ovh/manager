export default class CarbonFootprintService {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  computePreviousMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    const dateTimeFormat = new Intl.DateTimeFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        month: 'long',
        year: 'numeric',
      },
    );
    return dateTimeFormat.format(date);
  }
}
