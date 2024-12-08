import { TYPES } from './navigation-button.constants';
import { NAVIGATION } from '../../step/step.constants';

export default class {
  $onInit() {
    this.computedNavigationType = this.replaceStepIfNeeded();
    this.variant = this.variant
      ? this.variant
      : TYPES[this.computedNavigationType].variant;
    this.variantNav = this.variantNav
      ? this.variantNav
      : TYPES[this.computedNavigationType].variantNav;
  }

  async handleOnClick() {
    this.stepper.memorizeParameters(this.params);

    await (this.onClick ? this.onClick() : null);

    switch (this.computedNavigationType) {
      case TYPES.cancel.name:
      case TYPES.close.name:
        return this.stepper.close();
      case TYPES.next.name:
        return this.stepper.goToStep(NAVIGATION.NEXT_STEP);
      case TYPES.previous.name:
        return this.stepper.goToStep(NAVIGATION.PREVIOUS_STEP);
      default:
        throw new Error(`Unknown stepper button type ${this.type}`);
    }
  }

  replaceStepIfNeeded() {
    switch (this.navigationType) {
      case TYPES.next.name:
        return this.stepper.doesStepExist({ relativeIndex: 1 })
          ? this.navigationType
          : TYPES.close.name;
      case TYPES.previous.name:
        return this.stepper.doesStepExist({ relativeIndex: -1 })
          ? this.navigationType
          : TYPES.cancel.name;
      default:
        return this.navigationType;
    }
  }
}
