import controller from './hosting-cdn-shared-settings-cors.controller';
import template from './hosting-cdn-shared-settings-cors.html';

export default {
  bindings: {
    goBack: '<',
    cors: '<',
    onValidate: '<',
  },
  controller,
  template,
};
