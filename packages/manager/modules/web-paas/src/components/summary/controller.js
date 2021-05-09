import { STORAGE_MULTIPLY } from './constants';

export default class WebPaasSummaryCtrl {
  $onInit() {
    this.STORAGE_MULTIPLY = STORAGE_MULTIPLY;
  }

  getQuantity(quantity) {
    return quantity * this.STORAGE_MULTIPLY;
  }
}
