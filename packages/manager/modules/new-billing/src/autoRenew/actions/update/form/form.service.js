import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';
import { RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  getAvailableRenewPeriods(service) {
    return this.$http
      .get(`${get(service, 'route.url')}/serviceInfos`)
      .then(({ data }) => get(data, 'possibleRenewPeriod'))
      .then((possibleRenewPeriod) => {
        return map(possibleRenewPeriod, (period) => ({
          period,
          label: this.$translate.instant(
            'billing_autorenew_service_update_service_period_value',
            { month: period },
          ),
        }));
      });
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
