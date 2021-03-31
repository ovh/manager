export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.projects', {
    url: '/projects',
    component: 'webPaasProjects',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('projects')
        .then((projects) =>
          projects.length === 0 ? { state: 'web-paas.onboarding' } : null,
        ),
    resolve: {
      projects: /* @ngInject */ (WebPaas) => WebPaas.getProjects(),
      terminateProject: /* @ngInject */ ($state) => (project) =>
        $state.go('web-paas.projects.cancel', {
          projectId: project.serviceId,
          projectName: project.projectName,
        }),
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
