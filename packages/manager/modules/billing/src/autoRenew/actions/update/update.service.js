import {
  SERVICE_RENEW_MODES,
  SERVICE_TYPES_USING_V6_SERVICES,
} from '../../autorenew.constants';

export default class AutoUpdateRenewServiceModalService {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.coreConfig = coreConfig;
  }

  getAvailableRenewPeriods(service) {
    const isUSRegion = this.coreConfig.getRegion() === 'US';
    const manualRenewMode = isUSRegion ? [] : [SERVICE_RENEW_MODES.MANUAL];

    const fetchPeriods = SERVICE_TYPES_USING_V6_SERVICES.includes(
      service.serviceType,
    )
      ? this.$http
          .get(`/services/${service.id}/renewPeriodCapacities`)
          .then(({ data }) => [
            ...manualRenewMode,
            ...data.map(
              (period) => Number(period.match(/\d+/)?.[0]) || 'to_be_defined',
            ),
          ])
      : this.$http
          .get(`${service.route.url}/serviceInfos`)
          .then(({ data }) => [
            ...manualRenewMode,
            ...data.possibleRenewPeriod,
          ]);

    return fetchPeriods;
  }
}
