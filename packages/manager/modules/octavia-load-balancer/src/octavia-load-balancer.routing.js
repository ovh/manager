export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer', {
    url: '/pci/projects/{projectId:[0-9a-zA-Z]{32}}/octavia-load-balancer',
    template: '<div data-ui-view></div>',
    redirectTo: 'octavia-load-balancer.onboarding',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise,
      breadcrumb: (project) =>
        project.status !== 'creating' ? project.description : null,
    },
  });
};
