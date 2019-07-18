import controller from './header.controller';
import template from './header.html';

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
