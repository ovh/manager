import template from './template.html';

export default {
  template,
  transclude: true,
  bindings: {
    icon: '@',
    title: '<',
  },
};
