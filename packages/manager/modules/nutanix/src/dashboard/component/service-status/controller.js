import { SERVICE_BADGE_STATES } from './constants';
import { SERVICE_STATES } from '../../../constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getStatusBadgeStyle() {
    return (
      SERVICE_BADGE_STATES[this.status] ??
      SERVICE_BADGE_STATES[SERVICE_STATES.UNKNOWN]
    );
  }

  getStatusBadgeLabel() {
    const translateKey = `nutanix_dashboard_service_status_${this.status}`;
    const labelTranslated = this.$translate.instant(translateKey);

    return translateKey === labelTranslated ? this.status : labelTranslated;
  }
}
