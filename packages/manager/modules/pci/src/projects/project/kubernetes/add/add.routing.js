import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.add', {
      url: '/new',
      component: 'ovhManagerPciProjectKubernetesAdd',
      resolve: {
        regions: /* @ngInject */ (
          OvhApiCloudProjectKube,
          projectId,
        ) => OvhApiCloudProjectKube.v6()
          .getRegions({
            serviceName: projectId,
          }).$promise
          .then(regions => map(regions, region => ({
            name: region,
            hasEnoughQuota: () => true,
          }))),

        goBack: /* @ngInject */ goToKubernetes => goToKubernetes,

        breadcrumb: /* @ngInject */ $translate => $translate.instant('kubernetes_add'),
      },
    });
};
