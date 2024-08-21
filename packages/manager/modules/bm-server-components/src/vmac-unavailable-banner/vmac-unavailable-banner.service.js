import { VMAC_UNAVAILABLE_SERVICE_REGEX } from './vmac-unavailable-banner.constants';

export default class VmacUnavailableBannerService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  isVmacUnavailableForService(serviceId) {
    return this.$http
      .get(`/services/${serviceId}`)
      .then(({ data }) =>
        data.billing.plan.code.match(VMAC_UNAVAILABLE_SERVICE_REGEX),
      );
  }
}
