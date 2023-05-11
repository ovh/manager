import sortBy from 'lodash/sortBy';

import { LATEST_MODULES } from './domain-webhosting-order-steps-module.constants';
import { DOMAIN_TRACKING } from '../../../../../hosting/hosting.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  getModules() {
    this.module = undefined;
    this.isLoading = true;
    return this.getAvailableModules({ offer: this.stepper.cartOption.offer })
      .then((availableModules) => {
        this.availableModules = sortBy(
          availableModules
            .filter(({ planCode }) =>
              LATEST_MODULES.map(({ label }) => label).includes(planCode),
            )
            .map((module) => {
              const { id, recommendedOffer } = LATEST_MODULES.find(
                ({ label }) => label === module.planCode,
              );

              const [{ duration, pricingMode }] = module.prices;

              return {
                id,
                duration,
                ...module,
                pricingMode,
                recommendedOffer,
              };
            }),
          'id',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  updateModule() {
    this.stepper.cartOption.module = this.module;
    this.stepper.currentIndex += 1;
  }

  onModuleClick(module) {
    const { SELECT_CMS, SELECT_NO_CMS } = DOMAIN_TRACKING.STEP_2;
    const cmsHitTrack = module
      ? `${SELECT_CMS}${module.planCode}`
      : SELECT_NO_CMS;

    this.trackClick(cmsHitTrack);
    this.updateModule();
    this.trackClick(DOMAIN_TRACKING.STEP_2.GO_TO_NEXT_STEP);
  }
}
