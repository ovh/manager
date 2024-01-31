import { LABELS, HEALTH_MONITOR_TYPE } from '../../constants';
import {
  EXPECTED_STATUS_CODE_REGEX,
  HEALTH_MONITOR_NAME_REGEX,
  BOUNDS,
  POOL_HEALTH_MONITOR_TYPE,
  HORIZON_LINK,
} from './constants';

export default class OctaviaLoadBalancerHealthMonitorFormCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.LABELS = LABELS;
    this.BOUNDS = BOUNDS;
    this.NAME_REGEX = HEALTH_MONITOR_NAME_REGEX;
    this.EXPECTED_STATUS_CODE_REGEX = EXPECTED_STATUS_CODE_REGEX;
    this.HORIZON_LINK = HORIZON_LINK;
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

  onDelayChange(newDelay) {
    if (this.model.timeout >= newDelay) this.model.timeout = newDelay - 1;
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
