import controller from './maintenance-window.controller';
import template from './maintenance-window.html';

export default {
  template,
  controller,
  bindings: {
    disabled: '<',
    disableToggle: '<',
    maintenanceWindow: '<',
    onDataChange: '&',
    regionInfo: '<',
  },
};
