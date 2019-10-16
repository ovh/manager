import state from './selection.state';
import Step from '../../../../../components/stepper/step/step';
import StepHeader from '../../../../../components/stepper/step/step.header';

/* @ngInject */
export const factory = $translate => new Step(
  'selection',
  state,
  new StepHeader($translate.instant('dedicatedCloudDashboardTilesOptionsOrderSelection_stepper_header')),
);

export const name = 'ovhManagerPccServicePackUpgradeSelectionFactory';

export default {
  factory,
  name,
};
