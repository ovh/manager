import sortBy from 'lodash/sortBy';

import { LATEST_MODULES } from './domain-webhosting-order-steps-module.constants';
import { ORDER_WEBHOSTING_TRACKING } from '../../domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.module = undefined;
  }

  getModules() {
    if (this.module) {
      this.trackClick(ORDER_WEBHOSTING_TRACKING.PRE_INSTALL.EDIT);
    }
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
      ...hit,
      type: 'action',
    });
  }

  updateModule() {
    this.stepper.cartOption.module = this.module;
    this.stepper.currentIndex += 1;
  }

  onModuleClick(module) {
    this.updateModule();
    this.trackClick({
      ...ORDER_WEBHOSTING_TRACKING.PRE_INSTALL.CMS,
      name: ORDER_WEBHOSTING_TRACKING.PRE_INSTALL.CMS.name.replace(
        /{{cms}}/g,
        module?.planCode || 'none',
      ),
    });
  }
}
