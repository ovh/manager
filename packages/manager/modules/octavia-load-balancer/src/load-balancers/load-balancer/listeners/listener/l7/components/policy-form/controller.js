import { ACTIONS } from '../../constants';
import { ACTIONS_LIST, URL_PATTERN, URL_PLACEHOLDER } from './constants';

export default class OctaviaLoadBalancerL7PolicyFormCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.ACTIONS = ACTIONS;
    this.URL_PATTERN = URL_PATTERN;
    this.URL_PLACEHOLDER = URL_PLACEHOLDER;
    this.actions = ACTIONS_LIST;
  }

  $onInit() {
    this.submitButtonLabel =
      this.submitLabel ||
      this.$translate.instant('octavia_load_balancer_create_l7_policy_submit');
  }

  onActionChange(action) {
    if (
      [this.ACTIONS.REDIRECT_TO_URL, this.ACTIONS.REDIRECT_PREFIX].includes(
        action,
      )
    ) {
      this.model.redirectHttpCode = 302;
    } else {
      this.model.redirectHttpCode = undefined;
    }
    if (action !== this.ACTIONS.REDIRECT_TO_URL) {
      this.model.redirectUrl = undefined;
    }
    if (action !== this.ACTIONS.REDIRECT_PREFIX) {
      this.model.redirectPrefix = undefined;
    }
  }
}
