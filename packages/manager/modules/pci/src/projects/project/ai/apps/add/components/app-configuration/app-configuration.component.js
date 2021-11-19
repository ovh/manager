import controller from './app-configuration.controller';
import template from './app-configuration.html';

export default {
  bindings: {
    appModel: '<',
  },
  require: {
    appConfigurationForm: '^form',
  },
  controller,
  template,
};
