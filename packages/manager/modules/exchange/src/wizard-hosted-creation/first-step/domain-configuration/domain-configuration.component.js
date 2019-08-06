import controller from './domain-configuration.controller';
import template from './domain-configuration.html';

export default {
  template,
  controller,
  bindings: {
    displayComponent: '&',
  },
  require: {
    homepage: '^^exchangeWizardHostedCreation',
  },
};
