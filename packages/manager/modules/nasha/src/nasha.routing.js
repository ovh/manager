import { NASHA_TITLE } from './nasha.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    redirectTo: 'nasha.directory',
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: () => NASHA_TITLE,
    },
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
