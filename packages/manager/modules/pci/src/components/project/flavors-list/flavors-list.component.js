import controller from './flavors-list.controller';
import template from './flavors-list.html';

export default {
  controller,
  template,
  bindings: {
    catalogEndpoint: '<?',
    flavors: '<?',
    selectedFlavor: '=?',
    displaySelectedFlavor: '<',
    defaultFlavor: '<?',
    excludeCategories: '<?',
    image: '<?',
    includeCategories: '<?',
    onChange: '&?',
    onCategoryChange: '&?',
    region: '<?',
    selectedCategory: '@?',
    serviceName: '@',
    singleFlavorWarning: '@?',
    flavorCount: '<?',
    reload: '<',
    loadEnd: '&',
    displayLoader: '<?',
  },
};
