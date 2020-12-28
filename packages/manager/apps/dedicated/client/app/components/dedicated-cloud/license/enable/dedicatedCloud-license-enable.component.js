import controller from './dedicatedCloud-license-enable.controller';
import template from './dedicatedCloud-license-enable.html';

export default {
  template,
  controller,
  bindings: {
    dedicatedCloud: '<',
    goBack: '<',
  },
  name: 'dedicatedCloudLicenseEnable',
};
