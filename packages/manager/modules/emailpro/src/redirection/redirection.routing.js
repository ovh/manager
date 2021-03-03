import template from './emailpro-redirection.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.redirection', {
    url: '/redirection',
    template,
    controller: 'EmailMXPlanEmailRedirectionCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('emailpro_redirection'),
    },
  });
};
