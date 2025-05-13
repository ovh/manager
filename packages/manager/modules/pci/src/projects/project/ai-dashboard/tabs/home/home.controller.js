import { GUIDES, ITEMS_POLL_INTERVAL } from '../../ai-dashboard.constants';
import {
  BILLING_RESOURCES,
  TUTORIALS_TO_DISPLAY,
  UCENT_PRICE_MULTIPLIER,
} from './home.constants';

export default class AiDashboardHomeCtrl {
  /* @ngInject */
  constructor(
    $interval,
    $translate,
    AiDashboardService,
    atInternet,
    coreConfig,
  ) {
    this.$interval = $interval;
    this.$translate = $translate;
    this.AiDashboardService = AiDashboardService;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    // Poll data
    this.poller = this.$interval(() => this.getAIItems(), ITEMS_POLL_INTERVAL);

    this.getBillingData();
    this.getRandomTutorials();

    [this.documentationGuide] = GUIDES.filter(
      (guide) => guide.id === 'documentation',
    ).map((guide) => {
      return {
        id: guide.id,
        link:
          guide.link[this.coreConfig.getUser().ovhSubsidiary] ||
          guide.link.DEFAULT,
      };
    });
  }

  $onDestroy() {
    this.$interval.cancel(this.poller);
  }

  getAIItems() {
    this.AiDashboardService.getAIItems(this.projectId).then((data) => {
      this.aiItems = data;
    });
  }

  getBillingData() {
    this.nextBillingDate = this.billing.period.to;
    this.price =
      UCENT_PRICE_MULTIPLIER *
      this.billing.resourcesUsage.reduce(
        (sum, resource) =>
          BILLING_RESOURCES.includes(resource.type)
            ? sum + resource.totalPrice
            : sum,
        0,
      );
  }

  getRandomTutorials() {
    this.tutorials = [...this.homeAIGuides]
      .sort(() => 0.5 - Math.random())
      .slice(0, TUTORIALS_TO_DISPLAY);
  }

  trackAndGetRandomTutorials() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::tutorials::refresh`,
      type: 'action',
    });
    this.getRandomTutorials();
  }

  trackAndGoToObjectStorage() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::pipeline::object-storage`,
      type: 'action',
    });
    return this.goToObjectStorage();
  }

  trackAndGoToAINotebook() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::pipeline::ai-notebook`,
      type: 'action',
    });
    return this.goToAINotebooks();
  }

  trackAndGoToAITraining() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::pipeline::ai-training`,
      type: 'action',
    });
    return this.goToAITraining();
  }

  trackAndGoToAIDeploy() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::pipeline::ai-deploy`,
      type: 'action',
    });
    return this.goToAIDeploy();
  }

  trackAndGoToBilling() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::billing`,
      type: 'action',
    });
    return this.goToBilling();
  }

  trackAndGoToUsersAndTokens() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::users-tokens`,
      type: 'action',
    });
    return this.goToUsersAndTokens();
  }

  trackAndGoToDocumentation() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::home::documentation`,
      type: 'action',
    });
    window.open(this.documentationGuide.link, '_blank', 'noopener');
  }
}
