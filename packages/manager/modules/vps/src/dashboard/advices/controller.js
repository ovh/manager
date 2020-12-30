import get from 'lodash/get';

export default class DedicatedServerVpsAdvicesCtrl {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.loading = true;
    this.adviceGroups = [];
    this.loadAdvices()
      .then((adviceGroups) => {
        this.adviceGroups = adviceGroups;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadAdvices() {
    return this.$http
      .get(`/advices/${this.serviceType}/${this.serviceName}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        return get(data, 'data.adviceGroups');
      })
      .catch(() => []); // do not show any advices on error
  }
}
