export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.delete-datacenter',
    {
      url: '/delete/:datacenterId',
      views: {
        modal: {
          component: 'ovhManagerDedicatedCloudDatacenterDelete',
        },
      },
      params: {
        datacenterId: null,
      },
      layout: 'modal',
      resolve: {
        datacenterId: /* @ngInject */ ($transition$) =>
          $transition$.params().datacenterId,
        goBack: /* @ngInject */ ($state, $timeout, productId, setMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.dedicatedCloud.details.datacenter',
            { productId },
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
