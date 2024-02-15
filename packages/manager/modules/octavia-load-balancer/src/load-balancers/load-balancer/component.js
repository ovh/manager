import template from './template.html';

export default {
  bindings: {
    loadbalancer: '<',
    currentActiveLink: '<',
    generalInformationLink: '<',
    listenersLink: '<',
    poolsLink: '<',
    statisticsLink: '<',
    certificatesLink: '<',
  },
  template,
};
