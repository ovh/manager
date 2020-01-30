import map from 'lodash/map';
import values from 'lodash/values';
import { RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getAvailableRenewPeriods(service) {
    return map(service.possibleRenewPeriod, (period) => ({
      period,
      label: this.$translate.instant(
        'billing_autorenew_service_update_service_period_value',
        { month: period },
      ),
    }));
  }

  getRenewalTypes() {
    return map(values(RENEWAL_TYPES), (type) => ({
      type,
      label: this.$translate.instant(
        `billing_autorenew_service_update_service_${type}`,
      ),
    }));
  }
}
