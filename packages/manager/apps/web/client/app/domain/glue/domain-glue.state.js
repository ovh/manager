import template from './GLUE.html';

const state = {
  url: '/glue',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Glue',
    },
  },
  atInternet: {
    rename: 'GLUE',
  },
};

export default state;
