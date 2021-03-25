import template from './email-domain-task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.task', {
    url: '/task',
    template,
    controller: 'EmailsTabTasksCtrl',
    controllerAs: 'ctrlEmailsTabTasksCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_task'),
    },
  });
};
