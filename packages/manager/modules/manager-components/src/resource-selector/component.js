import template from './template.html';

export default {
  bindings: {
    price: '<?',
    priceSuffix: '@?',
    title: '@',
  },
  template,
  transclude: {
    price: '?resourceSelectorPrice',
  },
};
