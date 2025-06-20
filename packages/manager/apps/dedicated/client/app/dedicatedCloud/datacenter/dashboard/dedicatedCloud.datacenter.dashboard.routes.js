import { NSX_EDGE_RELOCATE_FEATURE } from '../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard',
    {
      url: '',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details':
          'ovhManagerDedicatedCloudDatacenterDashboard',
      },
      resolve: {
        breadcrumb: () => null,
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        datastoreOrderLink: /* @ngInject */ (
          coreURLBuilder,
          serviceName,
          datacenterId,
        ) =>
          coreURLBuilder.buildURL(
            'dedicated',
            `#/dedicated_cloud/${serviceName}/datacenter/${datacenterId}/datastores/order`,
          ),
        isNsxEdgeRelocateAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
          ovhFeatureFlipping
            .checkFeatureAvailability(NSX_EDGE_RELOCATE_FEATURE)
            .then((featureAvailability) =>
              featureAvailability.isFeatureAvailable(NSX_EDGE_RELOCATE_FEATURE),
            ),
        hostOrderLink: /* @ngInject */ (
          coreURLBuilder,
          serviceName,
          datacenterId,
        ) =>
          coreURLBuilder.buildURL(
            'dedicated',
            `#/dedicated_cloud/${serviceName}/datacenter/${datacenterId}/hosts/order`,
          ),
        nsxEdgeCurrentLevel: /* @ngInject */ (
          DedicatedCloud,
          serviceName,
          datacenterId,
        ) => {
          return DedicatedCloud.getDatacenterInfoNsxt(
            serviceName,
            datacenterId,
          ).then(([data]) => data?.size);
        },
        nsxtEdgesScalingCapabilities: /* @ngInject */ (
          DedicatedCloud,
          serviceName,
          datacenterId,
        ) => {
          return DedicatedCloud.getDatacenterNsxtEdgesScalingCapabilities(
            serviceName,
            datacenterId,
          )
            .then(({ data }) => data?.size)
            .catch(() => []);
        },
        goBackToDashboard: /* @ngInject */ (
          $state,
          $timeout,
          currentService,
          setMessage,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.dedicatedCloud.details.datacenter.details.dashboard',
            { productId: currentService.serviceName },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() => $timeout(() => setMessage(message, type)));
          }

          return promise;
        },
        goToRelocateNsxtEdge: ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.dashboard.move-nsxt-edge',
          ),
        goToResizeNsxEdge: ($state) => () =>
          $state.go(
            'app.dedicatedCloud.details.datacenter.details.dashboard.nsx',
          ),
        goBack: ($state) => () =>
          $state.go('app.dedicatedCloud.details.datacenter'),
      },
    },
  );
};
