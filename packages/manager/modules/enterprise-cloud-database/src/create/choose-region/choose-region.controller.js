import split from 'lodash/split';

export default class {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

  $onInit() {
    this.selectedRegion = this.enterpriseDb.datacenter;
  }

  onRegionSelect(region) {
    this.selectedRegion = region;
    this.enterpriseDb.datacenter = region;
    if (this.onChange) {
      this.$timeout(() => this.onChange({ region: this.selectedRegion }));
    }
  }

  static getIcons(region) {
    const splitArray = split(region, '-');
    return `flag-icon flag-icon-${splitArray[2]}`;
  }
}
