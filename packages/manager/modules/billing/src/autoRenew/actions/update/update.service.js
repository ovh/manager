import { SERVICE_RENEW_MODES, UNIT_YEARLY } from '../../autorenew.constants';

export default class AutoUpdateRenewServiceModalService {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.coreConfig = coreConfig;
    this.UNIT_YEARLY = UNIT_YEARLY;
  }

  convertPeriodsToMonths(period) {
    const value = parseInt(period?.slice(1, -1), 10);
    const unit = period?.slice(-1);
    return unit === this.UNIT_YEARLY ? value * 12 : value;
  }

  getAvailableRenewPeriods(service) {
    const isUSRegion = this.coreConfig.getRegion() === 'US';
    const manualRenewMode = isUSRegion ? [] : [SERVICE_RENEW_MODES.MANUAL];
    const fetchPeriods = this.$http
      .get(`/services/${service.id}/renewPeriodCapacities`)
      .then(({ data }) => [
        ...manualRenewMode,
        ...data.map(
          (period) => this.convertPeriodsToMonths(period) || 'to_be_defined',
        ),
      ]);
    return fetchPeriods;
  }
}
