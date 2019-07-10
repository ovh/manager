import template from './TASKS.html';

const state = {
  url: '/tasks',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Tasks',
    },
  },
  atInternet: {
    rename: 'TASKS',
  },
};

export default state;
