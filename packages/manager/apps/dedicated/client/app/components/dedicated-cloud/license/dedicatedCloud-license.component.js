import controller from './dedicatedCloud-license.controller';
import template from './dedicatedCloud-license.html';

export default {
  template,
  controller,
  bindings: {
    goToEnableLicense: '<',
    productId: '<',
    setMessage: '<',
    usesLegacyOrder: '<',
  },
  name: 'ovhManagerPccLicense',
};
