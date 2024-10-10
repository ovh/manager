export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard',
    {
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
      },
    },
  );
};
