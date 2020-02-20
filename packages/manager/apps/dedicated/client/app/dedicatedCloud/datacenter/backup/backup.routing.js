export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup', {
    url: '/backup',
    views: {
      pccDatacenterView: {
        component: 'ovhManagerDedicatedCloudBackup',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('backup')
        .then((backup) =>
          backup
            ? { state: 'app.dedicatedClouds.datacenter.backup.new' }
            : false,
        ),
    resolve: {
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,

      goToNewBackup: /* @ngInject */ ($state, datacenterId, productId) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup.new', {
          datacenterId,
          productId,
        }),
      goToBackup: ($state, CucCloudMessage, datacenterId, productId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'app.dedicatedClouds.datacenter.backup',
          {
            productId,
            datacenterId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'veeamBackup'));
        }
        return promise;
      },

      backup: /* @ngInject */ ($q) => $q.when(),
    },
  });
};
