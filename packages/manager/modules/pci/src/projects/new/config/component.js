import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewConfig',
  controller,
  template,
  bindings: {
    cart: '<',
    isValidHdsSupportLevel: '<',
    getActionHref: '<',
    goToPayment: '<',
    hds: '<',
    model: '<',
    summary: '<',
    getSummary: '<',
    trackClick: '<',
    trackPage: '<',
    projectsLink: '<',
    setCartProjectItem: '<',
    onProgressStepClick: '<',
    isItSubsidiary: '<',
  },
};
