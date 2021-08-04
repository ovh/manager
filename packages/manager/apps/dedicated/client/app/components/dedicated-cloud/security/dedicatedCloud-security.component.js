import controller from './dedicatedCloud-security.controller';
import template from './dedicatedCloud-security.html';

export default {
  template,
  controller,
  bindings: {
    addKms: '<',
    addSecurity: '<',
    deleteKms: '<',
    deleteSecurity: '<',
    editKms: '<',
    pccType: '<',
    productId: '<',
    securityLogout: '<',
    setMessage: '<',
    updateMaxSimultaneousConnection: '<',
    updateSecurity: '<',
    updateSessionTimeout: '<',
  },
  name: 'ovhManagerPccSecurity',
};
