import { OLD_CLUSTER_PLAN_CODE } from './constants';
import { getConstants } from '../../../../apps/dedicated/client/app/config/config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard', {
    url: '/:serviceName',
    redirectTo: (transition) => {
      const $translatePromise = transition.injector().getAsync('$translate');
      const serviceInfoPromise = transition.injector().getAsync('serviceInfo');

      return Promise.all([$translatePromise, serviceInfoPromise]).then(
        ([$translate, serviceInfo]) => {
          if (serviceInfo.isResiliated()) {
            return {
              state: 'error',
              params: {
                detail: {
                  message: $translate.instant(
                    'nutanix_dashboard_service_suspended',
                  ),
                  status: 'EXPIRED',
                  code: 404,
                },
                to: {
                  state: 'nutanix.index',
                },
              },
            };
          }

          return 'nutanix.dashboard.general-info';
        },
      );
    },
    component: 'nutanixDashboard',
    resolve: {
      trackingPrefix: /* @ngInject */ () => 'hpc::nutanix::cluster',
      cluster: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getCluster(serviceName),
      clusterAddOns: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getServiceOptions(serviceInfo.serviceId).catch(
          (error) => {
            if (error.status === 403) {
              return [];
            }
            throw error;
          },
        ),
      nodes: /* @ngInject */ (cluster, NutanixService) =>
        NutanixService.getNodeDetails(cluster),
      nodeId: /* @ngInject */ (cluster) => cluster.getFirstNode(),
      server: /* @ngInject */ (nodes) => nodes[0],
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      clusterServiceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceInfo: /* @ngInject */ (NutanixService, serviceName) =>
        NutanixService.getServiceInfo(serviceName),
      serviceDetails: /* @ngInject */ (NutanixService, serviceInfo) =>
        NutanixService.getServiceDetails(serviceInfo.serviceId).catch(
          (error) => {
            if (error.status === 403) {
              return;
            }
            throw error;
          },
        ),
      isOldCluster: /* @ngInject */ (NutanixService, serviceInfo) => {
        // If the plan code is nutanix-standard or nutanix-advanced or nutanix-byol its newCluster
        return NutanixService.getServicesDetails(serviceInfo.serviceId)
          .then((data) =>
            OLD_CLUSTER_PLAN_CODE.includes(data.billing.plan.code),
          )
          .catch((error) => {
            if (error.status === 403) {
              return undefined;
            }
            throw error;
          });
      },
      getTechnicalDetails: /* @ngInject */ (
        NutanixService,
        serviceInfo,
        server,
      ) =>
        NutanixService.getClusterHardwareInfo(
          serviceInfo.serviceId,
          server.serviceId,
        ).catch((error) => {
          if (error.status === 403) {
            return;
          }
          throw error;
        }),
      clusterTechnicalDetails: /* ngInject */ (getTechnicalDetails) =>
        getTechnicalDetails?.nutanixCluster,
      technicalDetails: /* ngInject */ (getTechnicalDetails) =>
        getTechnicalDetails?.baremetalServers,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      userResources: /* @ngInject */ (NutanixService) =>
        NutanixService.getUserResources().then(({ data }) => data),
      nutanixClusterIamName: /* @ngInject */ (
        userResources,
        serviceName,
        serviceDetails,
      ) => {
        const resourceIam = userResources.find(
          (resource) => resource.name === serviceName,
        );

        if (resourceIam === undefined) {
          return serviceDetails.resource.displayName;
        }

        return resourceIam.displayName;
      },
      expressOrderLink: /* @ngInject */ (coreConfig) => {
        const urls = getConstants(coreConfig.getRegion()).URLS;
        return (urls[coreConfig.getUser().ovhSubsidiary] ?? urls.FR)
          .express_order_resume;
      },
    },
  });
};
