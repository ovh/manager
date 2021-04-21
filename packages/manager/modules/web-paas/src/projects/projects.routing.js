import { find } from 'lodash';

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
      catalog: /* @ngInject */ (WebPaas, user) =>
        WebPaas.getCatalog(user.ovhSubsidiary),
      projects: /* @ngInject */ (WebPaas, catalog) => {
        return WebPaas.getProjects().then((projects) => {
          projects.forEach((project) => {
            project.setSelectedPlan(
              find(catalog.plans, { planCode: project.offer }),
            );
          });
          return projects;
        });
      },
      goToChangeOffer: /* @ngInject */ ($state) => (project) =>
        $state.go('web-paas.dashboard.service.change-offer', {
          projectId: project.serviceId,
        }),
      goToUserLicences: /* @ngInject */ ($state) => (project) =>
        $state.go('web-paas.dashboard.user-licences', {
          projectId: project.serviceId,
        }),
      terminateProject: /* @ngInject */ ($state) => (project) =>
        $state.go('web-paas.projects.cancel', {
          projectId: project.serviceId,
          projectName: project.projectName,
        }),
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
