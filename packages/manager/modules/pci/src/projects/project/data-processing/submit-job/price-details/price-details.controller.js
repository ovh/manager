export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.units = [
      {
        name: 'minute',
        multiplier: 1,
        description: this.$translate.instant(
          'data_processing_price_details_unit_minute',
        ),
      },
      {
        name: 'hour',
        multiplier: 60,
        description: this.$translate.instant(
          'data_processing_price_details_unit_hour',
        ),
      },
      {
        name: 'day',
        multiplier: 1440,
        description: this.$translate.instant(
          'data_processing_price_details_unit_day',
        ),
      },
    ];

    [this.unit] = this.units;
    this.time = 1;
  }
}
