import { TERMINATE_OPTIONS } from './vps-terminate.constants';

export default class {
  static getDegressivityMonthDetails(degressivityInformation) {
    const [price] = degressivityInformation.prices;
    const [degressivityMonth] = price.pricingMode.match(/\d+/g);
    return degressivityMonth;
  }

  static isTerminateNow(option) {
    return option.value === TERMINATE_OPTIONS.TERMINATE_NOW;
  }

  terminate() {
    this.isTerminating = true;
    return this.validateTermination(this.terminateOption.value);
  }
}
