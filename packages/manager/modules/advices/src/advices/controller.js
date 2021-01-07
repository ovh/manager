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
        adviceGroups.forEach((adviceGroup) => {
          this.trackImpressions(adviceGroup.advices);
        });
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

  /**
   * Tracks advice impression click and calls on click handler
   * @param {Object} advice
   */
  onClick(advice) {
    this.trackClickImpression(advice);
    if (typeof this.onAdviceClick === 'function') {
      this.onAdviceClick({ advice });
    }
  }

  trackImpressions(advices) {
    advices.forEach(
      (advice) =>
        advice.impression && this.atInternet.trackImpression(advice.impression),
    );
  }

  trackClickImpression(advice) {
    return (
      advice.impression &&
      this.atInternet.trackClickImpression(advice.impression)
    );
  }
}
