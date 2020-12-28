import { COMMERCIAL_RANGE_ENUM } from './dedicatedCloud-datacenter-add.constant';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.COMMERCIAL_RANGE_ENUM = COMMERCIAL_RANGE_ENUM;
  }

  $onInit() {
    this.loader = false;

    this.commercialRange = {
      list: [],
      model: null,
    };

    this.load();
  }

  load() {
    this.loader = true;
    this.DedicatedCloud.getCommercialRangeList(this.serviceName)
      .then(
        (list) => {
          this.commercialRange.list = list;
        },
        (data) => {
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_datacenters_adding_load_error',
            )}: ${data.message || ''}`,
            'danger',
          );
        },
      )
      .finally(() => {
        this.loader = false;
      });
  }

  addDatacenter() {
    this.loader = true;
    this.DedicatedCloud.addDatacenter(
      this.serviceName,
      this.commercialRange.model,
    ).then(
      () => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_datacenters_adding_success'),
        );
      },
      (data) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_error',
          )}: ${data.message || ''}`,
          'danger',
        );
      },
    );
  }
}
