import controller from './node-pool.controller';
import template from './node-pool.html';

export default {
  bindings: {
    region: '<',
    serviceName: '@',
    selectedFlavor: '=?',
    displaySelectedFlavor: '<',
    defaultFlavor: '<?',
    flavors: '<?',
  },
  controller,
  template,
};
