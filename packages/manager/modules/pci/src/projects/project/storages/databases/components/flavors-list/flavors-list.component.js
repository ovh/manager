import controller from './flavors-list.controller';
import template from './flavors-list.html';

export default {
  bindings: {
    currentFlavor: '<',
    onChange: '&?',
    flavors: '<',
    selectedFlavor: '=',
    user: '<',
    allowLowerSelection: '<?',
  },
  controller,
  template,
};
