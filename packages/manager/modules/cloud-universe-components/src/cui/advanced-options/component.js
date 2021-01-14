import template from './template.html';

export default {
  transclude: true,
  template,
  bindings: {
    title: '<',
    text: '<',
    buttonText: '<',
    expanded: '<',
  },
};
