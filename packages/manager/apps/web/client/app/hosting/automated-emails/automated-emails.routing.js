import controller from './hosting-automated-emails.controller';
import template from './AUTOMATED_EMAILS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.automated-emails', {
    url: '/automated-emails',
    template,
    controller,
    controllerAs: 'ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_automated_emails'),
    },
  });
};
