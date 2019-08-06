import controller from './email-creation.controller';
import template from './email-creation.html';

export default {
  template,
  controller,
  require: {
    homepage: '^^exchangeWizardHostedCreation',
  },
};
