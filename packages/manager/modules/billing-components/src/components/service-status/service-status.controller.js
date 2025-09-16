import { SERVICE_STATES_BADGES_CLASSES_MAP } from './service-status.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    if (
      this.service.hasDebt() ||
      this.service.status === 'IN_CREATION' ||
      !this.shouldHideAutorenewStatus()
    ) {
      this.statusBadge = this.getStatusBadge();
    } else if (this.shouldHideAutorenewStatus()) {
      this.statusBadge = this.service.isResiliated()
        ? this.getStatusBadge()
        : {
            label: '-',
            className: '',
          };
    }
  }

  getStatusBadge() {
    const parsedStatus = this.service.status.toLowerCase();
    return {
      label: this.$translate.instant(
        `manager_billing_service_status_${parsedStatus}`,
      ),
      className: `oui-badge_${SERVICE_STATES_BADGES_CLASSES_MAP[parsedStatus]}`,
    };
  }

  shouldHideAutorenewStatus() {
    return (
      this.service.isOneShot?.() || ['SMS'].includes(this.service.serviceType)
    );
  }
}
