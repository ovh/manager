import { getShellClient } from './shell';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci', {
    abstract: true,
    url: '',
    template: '<ui-view />',
    redirectTo: 'pci.projects',
    resolve: {
      pciFeatures: /* @ngInject */ (ovhFeatureFlipping) => {
        return ovhFeatureFlipping
          .checkFeatureAvailability(['public-cloud:vouchers'])
          .then((features) => features);
      },
    },
  });

  $stateProvider.state('pci.projects', {
    abstract: true,
    url: '/pci/projects',
    template: '<ui-view />',
    resolve: {
      checkHasProjects: /* @ngInject */ ($http) => {
        return $http
          .get('/cloud/project')
          .then((result) => result.data)
          .then((projectIds) => {
            if (!projectIds.length) {
              return getShellClient().navigation.navigateTo(
                'public-cloud',
                `#/pci/projects/onboarding`,
              );
            }
            return true;
          });
      },
    },
  });

  $stateProvider.state('pci.projects.project', {
    url: '/{projectId:[0-9a-zA-Z]{32}}',
    template: '<ui-view />',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,

      project: /* @ngInject */ (OvhApiCloudProject, projectId) =>
        OvhApiCloudProject.v6().get({
          serviceName: projectId,
        }).$promise,

      checkCreation: (project, projectId) => {
        if (project.status === 'creating') {
          return getShellClient().navigation.navigateTo(
            'public-cloud',
            `#/pci/projects/${projectId}/creating`,
          );
        }
        return Promise.resolve();
      },

      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,

      guideUrl: /* @ngInject */ (CucGuidesService) =>
        CucGuidesService.getGuides(),

      guideTrackingSectionTags: /* @ngInject */ (CucGuidesService) =>
        CucGuidesService.getTrackingTag(),

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },

      trackPage: /* @ngInject */ (atInternet) => (hit) => {
        return atInternet.trackPage({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
