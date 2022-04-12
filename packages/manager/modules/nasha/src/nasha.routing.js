import { NASHA_TITLE } from './nasha.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    redirectTo: 'nasha.directory',
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: () => NASHA_TITLE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('resources')
        .then((resources) =>
          resources.data.length === 0 ? 'nasha.onboarding' : false,
        ),
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
