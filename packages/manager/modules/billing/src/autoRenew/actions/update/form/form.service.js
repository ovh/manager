import get from 'lodash/get';
import map from 'lodash/map';
import values from 'lodash/values';
import { RENEWAL_TYPES } from './form.constants';
import { SERVICE_TYPES_USING_V6_SERVICES } from '../../../autorenew.constants';

export default class {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  getAvailableRenewPeriods(service) {
    if (SERVICE_TYPES_USING_V6_SERVICES.includes(service.serviceType)) {
      return this.$http
        .get(`/services/${service.id}/renewPeriodCapacities`)
        .then(({ data }) => data)
        .then((possibleRenewPeriod) => {
          return (
            possibleRenewPeriod?.map((period) => ({
              period,
              label: this.$translate.instant(
                'billing_autorenew_service_update_service_period_value',
                { month: period.match(/\d+/)?.[0] || 'to_be_defined' },
              ),
            })) || []
          );
        });
    }

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
