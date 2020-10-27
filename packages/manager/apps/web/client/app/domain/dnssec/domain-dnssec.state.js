import template from './DNSSEC.html';

const state = {
  url: '/dnssec',
  views: {
    domainView: {
      template,
      controller: 'DomainDnssecTabCtrl',
      controllerAs: 'ctrlDomainDnssec',
    },
  },
  atInternet: {
    rename: 'DNSSEC',
  },
};

export default state;
