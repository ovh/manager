import template from '../../domain/tasks/TASKS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.tasks', {
    url: '/tasks',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: 'controllers.Domain.Tasks',
        controllerAs: 'ctrlDomainTasks',
        template,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dnszone_tasks'),
    },
  });
};
