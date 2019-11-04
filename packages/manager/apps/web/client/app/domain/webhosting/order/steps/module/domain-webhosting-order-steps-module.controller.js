import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';

import { LATEST_MODULES } from './domain-webhosting-order-steps-module.constants';

export default class {
  $onInit() {
    this.availableModules = chunk(
      sortBy(
        this.availableModules
          .filter(({ planCode }) => LATEST_MODULES
            .map(({ label }) => label)
            .includes(planCode))
          .map((module) => {
            const { id, recommendedOffer } = LATEST_MODULES
              .find(({ label }) => label === module.planCode);

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
      ),
      3,
    );
  }

  updateModule() {
    this.stepper.cartOption.module = this.module;
    this.stepper.currentIndex += 1;
  }
}
