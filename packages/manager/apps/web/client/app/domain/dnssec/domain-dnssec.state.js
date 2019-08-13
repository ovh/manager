import template from './DNSSEC.html';

const state = {
  url: '/dnssec',
  views: {
    domainView: {
      template,
      controller: 'DomainDnssecTabCtrl',
    },
  },
  atInternet: {
    rename: 'DNSSEC',
  },
};

export default state;
