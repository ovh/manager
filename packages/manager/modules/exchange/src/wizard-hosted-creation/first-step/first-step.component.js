import controller from './first-step.controller';
import template from './first-step.html';

export default {
  template,
  controller,
  require: {
    homepage: '^^exchangeWizardHostedCreation',
  },
};
