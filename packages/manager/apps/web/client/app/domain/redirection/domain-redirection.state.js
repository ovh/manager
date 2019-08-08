import template from './REDIRECTION.html';

const state = {
  url: '/redirection',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Redirection',
    },
  },
  atInternet: {
    rename: 'REDIRECTION',
  },
};

export default state;
