export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer', {
    url: '/pci/projects/{projectId:[0-9a-zA-Z]{32}}/octavia-load-balancer',
    template: '<div data-ui-view></div>',
    redirectTo: 'octavia-load-balancer.onboarding',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      project: /* @ngInject */ ($http, projectId) =>
        $http.get(`/cloud/project/${projectId}`).then(({ data }) => data),
      breadcrumb: (project) =>
        project.status !== 'creating' ? project.description : null,
    },
  });
};
