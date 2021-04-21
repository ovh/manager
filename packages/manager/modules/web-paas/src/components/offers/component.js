import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    disabled: '<',
    previewMode: '<',
    offers: '<',
    onSelect: '&',
    user: '<',
  },
  controller,
  template,
};
