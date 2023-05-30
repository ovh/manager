export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.add-datacenter',
    {
      url: '/add-datacenter',
      views: {
        modal: {
          component: 'ovhManagerDedicatedCloudDatacenterAdd',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state, $timeout, productId, setMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.managedBaremetal.details.datacenters',
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
        goUpgradeRange: /* @ngInject */ ($state, productId) => (
          range,
          upgradeCode,
        ) => {
          return $state.go(
            'app.managedBaremetal.details.datacenters.add-datacenter.upgrade-range',
            { productId, range, upgradeCode },
          );
        },
        breadcrumb: () => null,
      },
    },
  );
};
