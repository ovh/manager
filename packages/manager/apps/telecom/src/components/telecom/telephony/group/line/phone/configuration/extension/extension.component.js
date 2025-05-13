import template from './extension.html';
import controller from './extension.controller';

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
