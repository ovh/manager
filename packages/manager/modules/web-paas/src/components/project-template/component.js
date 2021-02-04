import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    templates: '<',
    previewMode: '<',
    onSelect: '&',
  },
  controller,
  template,
};
