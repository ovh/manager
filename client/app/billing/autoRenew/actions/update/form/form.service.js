import _ from 'lodash';
import { RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  getAvailableRenewPeriods(service) {
    return _.map(
      service.possibleRenewPeriod,
      period => ({
        period,
        label: this.$translate.instant('billing_autorenew_service_update_service_period_value', { month: period }),
      }),
    );
  }

  getRenewalTypes() {
    return _.map(
      _.values(RENEWAL_TYPES),
      type => ({ type, label: this.$translate.instant(`billing_autorenew_service_update_service_${type}`) }),
    );
  }
}
