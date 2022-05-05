import has from 'lodash/has';

export default class CucConfirmationModalController {
  /* @ngInject */
  getMaxSize() {
    if (!has(this.usage, 'size.value')) {
      return null;
    }
    return parseInt(this.usage.size.value, 10);
  }

  $onInit() {
    this.help = this.help !== false;
  }
}
