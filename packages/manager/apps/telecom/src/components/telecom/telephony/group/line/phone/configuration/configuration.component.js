import template from './configuration.html';
import controller from './configuration.controller';

export default {
  template,
  controller,
  require: {
    configForm: '^form',
  },
  bindings: {
    configGroup: '=linePhoneConfigurationGroup',
    editMode: '=linePhoneConfigurationEditMode',
    expertMode: '=linePhoneConfigurationExpertMode',
  },
};
