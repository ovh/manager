import sortBy from 'lodash/sortBy';

import { LATEST_MODULES } from './domain-webhosting-order-steps-module.constants';

export default class {
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

  updateModule() {
    this.stepper.cartOption.module = this.module;
    this.stepper.currentIndex += 1;
  }
}
