import find from 'lodash/find';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.analytics-data-platform.details.cluster', {
    url: '/cluster',
    component: 'analyticsDataPlatformDetailsClusterComponent',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,

      platformDetails: /* @ngInject */ (
        analyticsDataPlatformService,
        serviceName,
      ) => analyticsDataPlatformService.getAnalyticsDataPlatformDetails(serviceName),

      publicCloudDetails: /* @ngInject */ (
        analyticsDataPlatformService,
        projectId,
      ) => analyticsDataPlatformService.getPubliCloudDetails(projectId),

      clusterNodes: /* @ngInject */ (
        analyticsDataPlatformService,
        flavors,
        serviceName,
      ) => analyticsDataPlatformService.getClusterNodesDetails(serviceName)
        .then((nodes) => map(nodes, (node) => {
          const flavor = find(flavors, { name: node.flavor });
          set(node, 'vcpus', flavor.vcpus);
          set(node, 'ram', flavor.ram);
          return node;
        })),

      flavors: /* @ngInject */ (
        analyticsDataPlatformService,
        platformDetails,
        projectId,
      ) => analyticsDataPlatformService.getFlavors(projectId, platformDetails.osRegion),

      breadcrumb: /* @ngInject */ ($translate) => $translate.instant('analytics_data_platform_header_nav_cluster_size'),
    },
  });
};
