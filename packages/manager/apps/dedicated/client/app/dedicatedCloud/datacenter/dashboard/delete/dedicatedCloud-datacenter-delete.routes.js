export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.dashboard.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'ovhManagerDedicatedCloudDatacenterDelete',
      },
    },
    layout: 'modal',
    translations: { value: ['../../../../dedicated/server'], format: 'json' },
    resolve: {
      datacenterId: /* @ngInject */ (datacenter) => datacenter.model.id,
      goBack: /* @ngInject */ (
        $state,
        $timeout,
        currentService,
        setMessage,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.dedicatedClouds.datacenter.dashboard',
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
  });
};
