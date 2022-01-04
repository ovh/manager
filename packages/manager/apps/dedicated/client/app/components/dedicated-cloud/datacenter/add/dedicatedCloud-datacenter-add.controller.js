import get from 'lodash/get';
import { COMMERCIAL_RANGE_ENUM } from './dedicatedCloud-datacenter-add.constant';

export default class {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
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

    this.DedicatedCloud.getOptionState('nsx', this.serviceName).then((data) => {
      this.nsxStatus = data;
    });
  }

  load() {
    this.loader = true;
    this.DedicatedCloud.getCommercialRangeCompliance(this.serviceName)
      .then((compliance) => {
        this.commercialRange.list = compliance;
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_load_error',
          )}: ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.loader = false;
      });
  }

  addDatacenter() {
    this.loader = true;

    if (get(this.commercialRange, 'model.upgradeRequired')) {
      return this.goUpgradeRange(
        get(this.commercialRange, 'model.name'),
        get(this.commercialRange, 'model.upgradeCode'),
      );
    }

    return this.DedicatedCloud.addDatacenter(
      this.serviceName,
      this.commercialRange.model.name,
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

  addOptionNSX() {
    return this.onBasicOptionsUpgrade({ isPremier: true });
  }
}
