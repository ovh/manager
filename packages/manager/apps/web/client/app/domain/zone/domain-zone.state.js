import template from './ZONE.html';

const state = {
  url: '/zone',
  views: {
    domainView: {
      template,
      controller: 'DomainTabZoneDnsCtrl',
    },
  },
  atInternet: {
    rename: 'ZONE',
  },
};

export default state;
