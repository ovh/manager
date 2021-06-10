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
      webPaasProjectsTablePrefix: () => 'web-paas::projects-table::',
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
      goToChangeOffer: /* @ngInject */ (
        $state,
        atInternet,
        webPaasProjectsTablePrefix,
      ) => (project) => {
        atInternet.trackClick({
          name: `${webPaasProjectsTablePrefix}options::change-range`,
          type: 'action',
        });
        return $state.go('web-paas.dashboard.service.change-offer', {
          projectId: project.serviceId,
        });
      },
      goToUserLicences: /* @ngInject */ (
        $state,
        atInternet,
        webPaasProjectsTablePrefix,
      ) => (project) => {
        atInternet.trackClick({
          name: `${webPaasProjectsTablePrefix}options::manage-user-licenses`,
          type: 'action',
        });
        $state.go('web-paas.dashboard.user-licences', {
          projectId: project.serviceId,
        });
      },
      terminateProject: /* @ngInject */ (
        $state,
        atInternet,
        webPaasProjectsTablePrefix,
      ) => (project) => {
        atInternet.trackClick({
          name: `${webPaasProjectsTablePrefix}options::cancel-project`,
          type: 'action',
        });
        return $state.go('web-paas.projects.cancel', {
          projectId: project.serviceId,
          projectName: project.projectName,
        });
      },
      breadcrumb: () => null, // Hide breadcrumb
    },
    atInternet: {
      rename: 'web::web-paas::all-projects',
    },
  });
};
