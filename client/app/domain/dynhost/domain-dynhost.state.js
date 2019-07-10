import template from './DYNHOST.html';

const state = {
  url: '/dynhost',
  views: {
    domainView: {
      template,
      controller: 'DomainTabDynHostCtrl',
    },
  },
  atInternet: {
    rename: 'DYNHOST',
  },
};

export default state;
