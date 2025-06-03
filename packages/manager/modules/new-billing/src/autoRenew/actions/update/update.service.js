import { SERVICE_RENEW_MODES } from './update.constants';
import { SERVICE_TYPES_USING_V6_SERVICES } from '../../autorenew.constants';

export default class AutoUpdateRenewServiceModalService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getAvailableRenewPeriods(service) {
    const fetchPeriods = SERVICE_TYPES_USING_V6_SERVICES.includes(
      service.serviceType,
    )
      ? this.$http
          .get(`/services/${service.id}/renewPeriodCapacities`)
          .then(({ data }) => [
            SERVICE_RENEW_MODES.MANUAL,
            ...data.map(
              (period) => Number(period.match(/\d+/)?.[0]) || 'to_be_defined',
            ),
          ])
      : this.$http
          .get(`${service.route.url}/serviceInfos`)
          .then(({ data }) => [
            SERVICE_RENEW_MODES.MANUAL,
            ...data.possibleRenewPeriod,
          ]);

    return fetchPeriods;
  }
}
