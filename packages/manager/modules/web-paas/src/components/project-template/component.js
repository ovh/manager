import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    onSelect: '&',
    previewMode: '<',
    templates: '<',
  },
  controller,
  template,
};
