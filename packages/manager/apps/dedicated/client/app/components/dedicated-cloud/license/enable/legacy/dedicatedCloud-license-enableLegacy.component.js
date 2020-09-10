import controller from './dedicatedCloud-license-enableLegacy.controller';
import template from './dedicatedCloud-license-enableLegacy.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    productId: '<',
  },
  name: 'dedicatedCloudLicenseEnableLegacy',
};
