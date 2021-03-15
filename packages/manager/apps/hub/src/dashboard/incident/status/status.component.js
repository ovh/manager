import controller from './status.controller';
import template from './template.html';

export default {
  bindings: {
    services: '<',
    translatedServiceEnum: '<',
    translatedStatusEnum: '<',
  },
  controller,
  template,
};
