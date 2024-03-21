import { LOG_KEYS } from '../constants';

export default class LogToCustomerCtrl {
  /* @ngInject */
  constructor() {
    this.LOG_KEYS = LOG_KEYS;
  }

  $onInit() {
    this.kind = this.kindInitValue;
  }
}
