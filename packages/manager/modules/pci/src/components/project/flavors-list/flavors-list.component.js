import controller from './flavors-list.controller';
import template from './flavors-list.html';

export default {
  controller,
  template,
  bindings: {
    flavors: '<?',
    selectedFlavor: '=?',
    displaySelectedFlavor: '<',
    defaultFlavor: '<?',
    excludeCategories: '<?',
    image: '<?',
    includeCategories: '<?',
    onChange: '&?',
    region: '<?',
    selectedCategory: '@?',
    serviceName: '@',
    singleFlavorWarning: '@?',
    flavorCount: '<?',
  },
};
