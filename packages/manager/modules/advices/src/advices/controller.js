const ADVICE_TYPE_ENUM = {
  RETENTION: 'retention',
  UPSELL_CROSS_SELL: 'upsell-cross-sell',
};

export default class AdvicesCtrl {
  /* @ngInject */
  constructor($http, atInternet, $element) {
    this.$http = $http;
    this.atInternet = atInternet;
    this.$element = $element;
  }

  $onInit() {
    if (!this.adviceType) {
      this.adviceType = ADVICE_TYPE_ENUM.UPSELL_CROSS_SELL;
    }
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
        this.onAdvicesLoaded(this.adviceGroups);
      });
  }

  loadAdvices() {
    return this.$http
      .get(this.getUrl(), {
        serviceType: 'aapi',
        params: this.queryParams,
      })
      .then(({ data }) => data.data.adviceGroups)
      .catch(() => []); // do not show any advices on error
  }

  getUrl() {
    if (this.serviceType && this.serviceName) {
      return `/advices/${this.serviceType}/${this.serviceName}`;
    }
    if (this.url && this.urlParams) {
      const url = AdvicesCtrl.formatUrl(this.url, this.urlParams);
      return url.startsWith('/') ? `/advices${url}` : `/advices/${url}`;
    }
    return '/advices';
  }

  static formatUrl(url, params) {
    return url.replace(
      /(^|\/):(\w+)(?=\/|$)/g,
      (m, g1, g2) => g1 + (params[g2] || m),
    );
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
      this.atInternet.trackClickImpression({
        click: advice.impression,
      })
    );
  }

  onAdvicesLoaded(advices) {
    if (typeof this.onLoad === 'function') {
      this.onLoad({ advices });
    }
    if (advices.length === 0) {
      this.$element.remove();
    }
  }

  isRetention() {
    return this.adviceType === ADVICE_TYPE_ENUM.RETENTION;
  }
}
