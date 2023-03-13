import { ONBOARDING_TUTORIALS_SLUGS } from './onboarding.constants';

export default class AiDashboardOnboardingCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.tutorials = ONBOARDING_TUTORIALS_SLUGS.map((slug) =>
      this.aiGuides.find((guide) => guide.slug === slug),
    );
  }

  trackAndGoToObjectStorage() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::onboarding::object-storage`,
      type: 'action',
    });
    return this.goToObjectStorage();
  }

  trackAndGoToAINotebooks() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::onboarding::ai-notebooks`,
      type: 'action',
    });
    return this.goToAINotebooks();
  }

  trackAndGoToAITraining() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::onboarding::ai-training`,
      type: 'action',
    });
    return this.goToAITraining();
  }

  trackAndGoToAIDeploy() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::onboarding::ai-deploy`,
      type: 'action',
    });
    return this.goToAIDeploy();
  }
}
