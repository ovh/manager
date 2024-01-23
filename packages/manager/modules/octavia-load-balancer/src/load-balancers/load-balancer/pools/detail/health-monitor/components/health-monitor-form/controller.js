import {
  EXPECTED_STATUS_CODE_REGEX,
  HEALTH_MONITOR_NAME_REGEX,
  HEALTH_MONITOR_TYPE,
  LABELS,
  BOUNDS,
  POOL_HEALTH_MONITOR_TYPE,
} from './constants';

export default class OctaviaLoadBalancerHealthMonitorFormCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.LABELS = LABELS;
    this.BOUNDS = BOUNDS;
    this.NAME_REGEX = HEALTH_MONITOR_NAME_REGEX;
    this.EXPECTED_STATUS_CODE_REGEX = EXPECTED_STATUS_CODE_REGEX;
  }

  $onInit() {
    // Only some Health Monitors types are available depending of the pool protocol
    this.healthMonitorTypes =
      POOL_HEALTH_MONITOR_TYPE[this.associatedPool.protocol];

    // If no label given, use default submit label
    this.submitLabel = this.submitLabel
      ? this.submitLabel
      : this.$translate.instant(
          'octavia_load_balancer_health_monitor_form_submit',
        );

    this.displayHttpSpecificFields =
      this.model.type && this.constructor.isTypeHttpOrHttps(this.model.type);
  }

  onPeriodicityChange(newPeriodicity) {
    if (this.model.timeout >= newPeriodicity)
      this.model.timeout = newPeriodicity - 1;
  }

  onTypeChange(newType) {
    if (this.constructor.isTypeHttpOrHttps(newType)) {
      this.displayHttpSpecificFields = true;
      this.model.urlPath = '/';
      this.model.expectedCode = 200;
    } else {
      this.displayHttpSpecificFields = false;
      delete this.model.urlPath;
      delete this.model.expectedCode;
    }
  }

  static isTypeHttpOrHttps(type) {
    return [HEALTH_MONITOR_TYPE.HTTP, HEALTH_MONITOR_TYPE.HTTPS].includes(type);
  }
}
