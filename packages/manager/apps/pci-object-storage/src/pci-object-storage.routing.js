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
          .checkFeatureAvailability(['public-cloud:block-storage'])
          .then((features) => features);
      },
      user: /* @ngInject */ (shellClient) => {
        return shellClient.environment.getEnvironment().then((data) => {
          return data.user;
        });
      },
    },
  });

  $stateProvider.state('pci.projects', {
    abstract: true,
    url: '/pci/projects',
    template: '<ui-view />',
    resolve: {
      pciFeatures: /* @ngInject */ (ovhFeatureFlipping) => {
        return ovhFeatureFlipping
          .checkFeatureAvailability(['public-cloud:trusted-zone'])
          .then((features) => features);
      },
      isTrustedZone: /* @ngInject */ (pciFeatures) => {
        return pciFeatures.isFeatureAvailable('public-cloud:trusted-zone');
      },
      catalogEndpoint: /* @ngInject */ (isTrustedZone) => {
        return `/order/catalog/${
          isTrustedZone ? 'private/trustedZoneCloud' : 'public/cloud'
        }`;
      },
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

      customerRegions: /* @ngInject */ ($http, projectId) => {
        return $http
          .get(`/cloud/project/${projectId}/region`)
          .then(({ data: regions }) => regions);
      },

      steins: /* @ngInject */ ($http) =>
        $http
          .get('/cloud/migrationStein')
          .then(({ data: steins }) =>
            steins.sort(
              (stein1, stein2) => new Date(stein1.date) - new Date(stein2.date),
            ),
          ),

      checkCreation: /* @ngInject */ (project, projectId) => {
        if (project.status === 'creating') {
          return getShellClient().navigation.navigateTo(
            'public-cloud',
            `#/pci/projects/${projectId}/creating`,
          );
        }
        return Promise.resolve();
      },

      goToRegion: /* @ngInject */ (projectId) => () => {
        return getShellClient().navigation.navigateTo(
          'public-cloud',
          `#/pci/projects/${projectId}/regions`,
        );
      },

      breadcrumb: /* @ngInject */ (project) =>
        project.status !== 'creating' ? project.description : null,

      guideUrl: /* @ngInject */ (CucGuidesService) =>
        CucGuidesService.getGuides(),

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
      redirectTarget: /* @ngInject */ ($transition$) =>
        JSON.parse($transition$.params()?.target || '{}'),
    },
  });

  $stateProvider.state('pci.projects.project.storages', {
    abstract: true,
    url: '/storages',
    template: '<ui-view />',
  });
};
