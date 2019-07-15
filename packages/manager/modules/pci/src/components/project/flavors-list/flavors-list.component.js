import controller from './flavors-list.controller';
import template from './flavors-list.html';

export default {
  controller,
  template,
  bindings: {
    selectedFlavor: '=?',
    displaySelectedFlavor: '<',
    defaultFlavor: '<?',
    image: '<?',
    onChange: '&?',
    region: '<?',
    serviceName: '@',
  },
};
