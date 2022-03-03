import template from './index.html';

export default {
  name: 'pciProjectNew',
  template,
  bindings: {
    isTrustedZone: '<',
    projects: '<',
    isHdsAvailable: '<',
    isValidHdsSupportLevel: '<',
  },
};
