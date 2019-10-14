import template from '../../domain/tasks/TASKS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.dns-zone.tasks', {
    url: '/tasks',
    views: {
      'dnsZoneView@app.domain.dns-zone': {
        controller: 'controllers.Domain.Tasks',
        controllerAs: 'ctrlDomainTasks',
        template,
      },
    },
  });
};
