angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.hosts', {
      url: '/hosts',
      reloadOnSearch: false,
      views: {
        pccDatacenterView: {
          templateUrl:
            'dedicatedCloud/datacenter/host/dedicatedCloud-datacenter-host.html',
          controller: 'DedicatedCloudSubDatacentersHostCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['../../../dedicated/server'], format: 'json' },
    });

    $stateProvider.state('app.dedicatedClouds.datacenter.hosts.order', {
      url: '/order',
      views: {
        'pccDatacenterView@app.dedicatedClouds.datacenter': {
          templateUrl:
            'dedicatedCloud/datacenter/host/order/dedicatedCloud-datacenter-host-order.html',
          controller: 'DedicatedCloudDatacentersHostOrderCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        serviceName: /* @ngInject */ ($stateParams) => $stateParams.productId,
        datacenterId: /* @ngInject */ ($stateParams) =>
          $stateParams.datacenterId,
      },
    });
  },
);
