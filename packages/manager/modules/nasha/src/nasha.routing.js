import { NASHA_TITLE } from './nasha.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: () => NASHA_TITLE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .get('iceberg')('/dedicated/nasha')
        .query()
        .limit(1)
        .execute(null)
        .$promise.then(({ data }) =>
          data.length ? 'nasha.directory' : 'nasha.onboarding',
        ),
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
