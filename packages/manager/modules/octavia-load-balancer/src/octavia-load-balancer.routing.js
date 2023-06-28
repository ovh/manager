export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer', {
    url: '/octavia-load-balancer',
    template: '<div data-ui-view></div>',
    redirectTo: 'octavia-load-balancer.onboarding',
    resolve: {
      breadcrumb: ($translate) => $translate.instant('octavia_lb'),
    },
  });
};
