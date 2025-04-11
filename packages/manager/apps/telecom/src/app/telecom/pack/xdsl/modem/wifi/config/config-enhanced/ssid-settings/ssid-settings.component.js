import controller from './ssid-settings.controller';
import template from './ssid-settings.html';

export default {
  controller,
  template,
  controllerAs: 'SSIDSettingsCtrl',
  bindings: {
    isLoading: '<',
    isUpdateEnabled: '<',
    ssidSettings: '<',
    onSubmit: '&',
  },
};
