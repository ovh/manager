import template from './user-interface.html';
import controller from './user-interface.controller';

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
