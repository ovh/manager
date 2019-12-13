import controller from './domain-dns.controller';
import template from './DNS.html';

const state = {
  url: '/dns',
  views: {
    domainView: {
      controller,
      controllerAs: '$ctrl',
      template,
    },
  },
  atInternet: {
    rename: 'DNS',
  },
};

export default state;
