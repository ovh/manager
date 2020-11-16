import controller from './service-pack-picker.controller';
import template from './service-pack-picker.html';

export default {
  bindings: {
    defaultValue: '<?',
    onChange: '&',
    servicePacks: '<',
  },
  controller,
  name: 'pccServicePackPicker',
  template,
};
