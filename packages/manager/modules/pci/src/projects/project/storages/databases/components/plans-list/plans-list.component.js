import controller from './plans-list.controller';
import template from './plans-list.html';

export default {
  bindings: {
    currentPlan: '<',
    onChange: '&?',
    plans: '<',
    selectedPlan: '=',
    user: '<',
    allowLowerSelection: '<?',
  },
  controller,
  template,
};
