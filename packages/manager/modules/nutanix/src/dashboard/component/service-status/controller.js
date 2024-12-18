import { SERVICE_BADGE_STATE, SERVICE_STATE } from './constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getStatusBadgeStyle() {
    return (
      SERVICE_BADGE_STATE[this.status] ??
      SERVICE_BADGE_STATE[SERVICE_STATE.UNKNOWN]
    );
  }

  getStatusBadgeLabel() {
    const translateKey = `nutanix_service_status_${this.status}`;
    const labelTranslated = this.$translate.instant(translateKey);

    return translateKey === labelTranslated ? this.status : labelTranslated;
  }
}
