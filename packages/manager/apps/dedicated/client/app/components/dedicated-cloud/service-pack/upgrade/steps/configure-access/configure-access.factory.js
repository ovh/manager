import state from './configure-access.state';
import Step from '../../../../../stepper/step/step';
import StepHeader from '../../../../../stepper/step/step.header';

/* @ngInject */
export const factory = ($translate) =>
  new Step(
    'configure-access',
    state,
    new StepHeader(
      $translate.instant(
        'dedicatedCloudDashboardTilesOptionsOrderConfigureAccess_stepper_header',
      ),
    ),
  );

export const name = 'ovhManagerPccServicePackUpgradeConfigureAccessFactory';

export default {
  factory,
  name,
};
