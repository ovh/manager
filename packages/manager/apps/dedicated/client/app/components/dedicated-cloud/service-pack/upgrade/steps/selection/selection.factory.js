import state from './selection.state';
import Step from '../../../../../stepper/step/step';
import StepHeader from '../../../../../stepper/step/step.header';

/* @ngInject */
export const factory = ($translate) =>
  new Step(
    'selection',
    state,
    new StepHeader(
      $translate.instant(
        'dedicatedCloudDashboardTilesOptionsOrderSelection_stepper_header',
      ),
    ),
  );

export const name = 'ovhManagerPccServicePackUpgradeSelectionFactory';

export default {
  factory,
  name,
};
