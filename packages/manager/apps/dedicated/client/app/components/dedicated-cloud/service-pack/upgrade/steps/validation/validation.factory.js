import state from './validation.state';
import Step from '../../../../../stepper/step/step';
import StepHeader from '../../../../../stepper/step/step.header';

/* @ngInject */
export const factory = ($translate) =>
  new Step(
    'validation',
    state,
    new StepHeader(
      $translate.instant(
        'dedicatedCloudDashboardTilesOptionsOrderValidation_stepper_header',
      ),
    ),
  );

export const name = 'ovhManagerPccServicePackUpgradeValidationFactory';

export default {
  factory,
  name,
};
