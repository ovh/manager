import controller from './navigation-button.controller';
import template from './navigation-button.html';

export default {
  bindings: {
    disabled: '<?',
    id: '@?',
    name: '@?',
    navigationType: '@',
    onClick: '&?',
    params: '<?',
    selectedItem: '<?',
    type: '@?',
    variant: '@?',
    variantNav: '@?',
  },
  controller,
  name: 'ouiStepperVNavigationButton',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
  transclude: true,
};
