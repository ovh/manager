import controller from './radio-settings.controller';
import template from './radio-settings.html';

export default {
  controller,
  template,
  controllerAs: 'RadioSettingsCtrl',
  bindings: {
    isLoading: '<',
    isUpdateEnabled: '<',
    radioSettings: '<',
    onSubmit: '&',
  },
};
