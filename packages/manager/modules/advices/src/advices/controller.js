export default class AdvicesCtrl {
  /* @ngInject */
  constructor($http, atInternet) {
    this.$http = $http;
    this.atInternet = atInternet;
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
        params: this.queryParams,
      })
      .then(({ data }) => data.data.adviceGroups)
      .catch(() => []); // do not show any advices on error
  }

  onClick(advice) {
    if (advice.tag) {
      this.atInternet.trackClick({
        name: advice.tag,
        type: 'action',
      });
    }

    if (typeof this.onAdviceClick === 'function') {
      this.onAdviceClick({ advice });
    }
  }
}
