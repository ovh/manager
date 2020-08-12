import template from './email-domain-task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.task', {
    url: '/task',
    template,
    controller: 'EmailsTabTasksCtrl',
    controllerAs: 'ctrlEmailsTabTasksCtrl',
  });
};
