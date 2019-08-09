import step from './step';
import Step from '../../stepper/step';

export default class {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  buildStep() {
    return new Step(
      step.componentName,
      this.$translate.instant(step.translationId),
      step.name,
      step.state,
    );
  }
}
