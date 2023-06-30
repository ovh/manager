export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.add-datacenter', {
    url: '/add-datacenter',
    views: {
      'pccView@app.dedicatedCloud.details':
        'ovhManagerDedicatedCloudDatacenterAdd',
    },
    resolve: {
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
      goUpgradeRange: /* @ngInject */ ($state, productId) => (
        range,
        upgradeCode,
      ) => {
        return $state.go(
          'app.dedicatedCloud.details.datacenter.add-datacenter.upgrade-range',
          { productId, range, upgradeCode },
        );
      },
      onBasicOptionsUpgrade: /* @ngInject */ ($state) => (stateParams) =>
        $state.go(
          'app.dedicatedCloud.details.servicePackUpgrade.basicOptions',
          stateParams,
        ),
      breadcrumb: () => null,
    },
  });
};
