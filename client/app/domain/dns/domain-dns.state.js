import template from './DNS.html';

const state = {
  url: '/dns',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Dns',
    },
  },
  atInternet: {
    rename: 'DNS',
  },
};

export default state;
