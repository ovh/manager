import controller from './general.controller';
import template from './general.html';

export default {
  template,
  controller,
  bindings: {
    capabilities: '<',
    publicCloud: '<',
    onDataChange: '&',
  },
};
