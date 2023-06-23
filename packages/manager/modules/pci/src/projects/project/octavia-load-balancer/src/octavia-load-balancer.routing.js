export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.octavia-load-balancer', {
    url: '/octavia-load-balancer',
    template: '<div data-ui-view></div>',
    redirectTo: 'pci.projects.project.octavia-load-balancer.onboarding',
    resolve: {
      breadcrumb: ($translate) => $translate.instant('octavia_lb'),
    },
  });
};
