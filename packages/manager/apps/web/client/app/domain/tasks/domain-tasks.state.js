import template from './TASKS.html';

const state = {
  url: '/tasks',
  views: {
    domainView: {
      template,
      controller: 'controllers.Domain.Tasks',
      controllerAs: 'ctrlDomainTasks',
    },
  },
  atInternet: {
    rename: 'TASKS',
  },
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_tasks'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.tasks', { ...state });
  $stateProvider.state('app.alldom.domain.tasks', { ...state });
};
