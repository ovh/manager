export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.dashboard.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'ovhManagerDedicatedCloudDatacenterDelete',
        },
      },
      layout: 'modal',
      translations: { value: ['../../../../dedicated/server'], format: 'json' },
      resolve: {
        goBack: /* @ngInject */ (
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
        breadcrumb: () => null,
      },
    },
  );
};
