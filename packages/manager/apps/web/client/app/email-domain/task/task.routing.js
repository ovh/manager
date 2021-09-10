import controller from './email-domain-tab-task.controller';
import template from './email-domain-task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.task', {
    url: '/task',
    template,
    controller,
    controllerAs: 'ctrlEmailsTabTasksCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_task'),
    },
  });
};
