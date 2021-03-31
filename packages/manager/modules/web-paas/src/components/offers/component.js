import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    offers: '<',
    previewMode: '<',
    user: '<',
    disabled: '<',
    onSelect: '&',
  },
  controller,
  template,
};
