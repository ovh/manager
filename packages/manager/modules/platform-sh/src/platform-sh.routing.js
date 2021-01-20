export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh', {
    url: '/paas/webpaas/projects',
    component: 'platformSh',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('projects')
        .then((projects) =>
          projects.length === 0 ? { state: 'platform-sh.onboarding' } : false,
        ),
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      projects: /* @ngInject */ (PlatformSh) => PlatformSh.getProjects(),
      createProject: /* @ngInject */ ($state) => () =>
        $state.go('platform-sh.add'),
      viewDetails: /* @ngInject */ ($state) => (projectId) =>
        $state.go('platform-sh.details', {
          projectId,
        }),
      terminateProject: /* @ngInject */ ($state) => (project) =>
        $state.go('platform-sh.cancel', {
          projectId: project.serviceId,
          projectName: project.projectName,
        }),
      openPartnerConsole: /* @ngInject */ ($window) => (project) =>
        $window.open(project.metadata.partnerConsole, '_blank', 'noopener'),
      goToPlatformSh: ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('platform-sh', {
          reload,
        });

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'platform-sh'));
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('platform_sh_title'),
    },
  });
};
