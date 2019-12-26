import state from './place-order.state';
import Step from '../../../../../components/stepper/step/step';
import StepHeader from '../../../../../components/stepper/step/step.header';

/* @ngInject */
export const factory = () =>
  new Step('placeOrder', state, new StepHeader(null, null, false));

export const name = 'ovhManagerPccServicePackUpgradePlaceOrderFactory';

export default {
  factory,
  name,
};
