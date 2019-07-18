import controller from './summary.controller';
import template from './summary.html';

export default {
  template,
  controller,
  require: {
    homepage: '^^exchangeWizardHostedCreation',
  },
};
