import { SERVICE_TYPE, TERMINATE_OPTIONS } from './vps-terminate.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.serviceType = SERVICE_TYPE.VPS;
  }

  static getDegressivityMonthDetails(degressivityInformation) {
    const [price] = degressivityInformation.prices;
    const [degressivityMonth] = price.pricingMode.match(/\d+/g);
    return degressivityMonth;
  }

  static isTerminateNow(option) {
    return option.value === TERMINATE_OPTIONS.TERMINATE_NOW;
  }

  onConfirm() {
    this.atInternet.trackClick({
      name: 'vps::detail::dashboard::terminate::confirm',
      type: 'action',
    });
    this.isTerminating = true;
    return this.validateTermination(this.terminateOption.value);
  }

  onCancel() {
    this.atInternet.trackClick({
      name: 'vps::detail::dashboard::terminate::cancel',
      type: 'action',
    });
    this.cancel();
  }
}
