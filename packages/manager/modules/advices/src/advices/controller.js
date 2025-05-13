import { ADVICE_TYPE_ENUM, RECOMMENDER_SYSTEM } from './constants';

export default class AdvicesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $http,
    atInternet,
    $element,
    $translate,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.atInternet = atInternet;
    this.$element = $element;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    if (!this.adviceType) {
      this.adviceType = ADVICE_TYPE_ENUM.UPSELL_CROSS_SELL;
    }
    this.loading = true;
    this.adviceGroups = [];

    this.$q
      .all([...this.fetchAllAdvices(), this.getRecommenderSystemAvailability()])
      .then(
        ([
          adviceGroups,
          recommendationAdvices,
          isRecommenderSystemRightRegions,
        ]) => {
          this.isRecommenderSystemRightRegions = isRecommenderSystemRightRegions;
          this.adviceGroups = this.getAdviceGroups(
            adviceGroups,
            recommendationAdvices,
          );

          this.adviceGroups.forEach((adviceGroup) => {
            this.trackImpressions(adviceGroup.advices);
          });
        },
      )
      .finally(() => {
        this.loading = false;
        this.onAdvicesLoaded(this.adviceGroups);
      });
  }

  getRecommenderSystemAvailability() {
    const recommenderSystemId = 'advices:recommender-system';
    return this.ovhFeatureFlipping
      .checkFeatureAvailability(recommenderSystemId)
      .then((feature) => feature.isFeatureAvailable(recommenderSystemId))
      .catch(() => false); // do not show recommender system advices on error
  }

  fetchAllAdvices() {
    return [this.loadAdvices(), this.loadRecommenderSystemAdvices()];
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

  loadRecommenderSystemAdvices() {
    return this.$http
      .get('/me/recommendations', {
        params: {
          max: RECOMMENDER_SYSTEM.MAX_RECOMMENDATION,
          range: this.recommanderRange,
        },
      })
      .then(({ data }) => data)
      .catch(() => []); // do not show any advices on error
  }

  getAdviceGroups(advicesGroup, recommenderAdvices) {
    // Applied Recommender System Advice
    if (this.isRecommenderSystemAvailable(recommenderAdvices)) {
      return this.formatRecommenderSystemAdvices(
        recommenderAdvices.recommendations,
      );
    }

    return advicesGroup;
  }

  isRecommenderSystemAvailable(recommenderAdvices) {
    const advices = recommenderAdvices?.recommendations || [];
    const localizedAdvices = advices.filter((advice) => {
      return !!advice.localizedDescription[this.coreConfig.getUserLocale()];
    });

    return (
      this.adviceType !== 'retention' &&
      this.isRecommenderSystemRightRegions &&
      localizedAdvices.length > 0 &&
      ['fr_FR', 'en_GB'].includes(this.coreConfig.getUserLocale())
    );
  }

  formatRecommenderSystemAdvices(recommendations) {
    const advices = recommendations
      .filter((recommendation) => {
        return !!recommendation?.localizedDescription[
          this.coreConfig.getUserLocale()
        ];
      })
      .map(({ localizedDescription, ...rest }) => {
        const advice = rest.advices[0]; // there is only one advice

        return {
          ...rest,
          localizedDescription:
            localizedDescription[this.coreConfig.getUserLocale()],
          advices: [
            {
              ...advice,
              localizedName: this.$translate.instant(
                'advices_recommender_system_know_more',
              ),
              impression: {
                campaignId: '[xsell-upsell]',
                creation: '[recommender-system]',
                format: '[tile]',
                generalPlacement: `[${this.serviceType}]`,
                detailedPlacement: `[${advice.id}]`,
              },
            },
          ],
        };
      })
      .reduce((advicesAcc, advice) => {
        if (advicesAcc.length < RECOMMENDER_SYSTEM.MAX_RECOMMENDATION) {
          advicesAcc.push(advice);
        }

        return advicesAcc;
      }, []); // get only the max souhaitable advices number;

    return advices;
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
