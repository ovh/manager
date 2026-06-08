export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp', {
      url: '/drp',
      views: {
        'pccDatacenterView@app.dedicatedCloud.details.datacenter.details': {
          component: 'dedicatedCloudDatacenterZertoDrp',
        },
      },
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
      resolve: {
        breadcrumb: () => null,
        configurationState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
        vraState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.vra',
        ltrState: () =>
          'app.dedicatedCloud.details.datacenter.details.zerto.drp.ltr',
      },
    })
    .state(
      'app.dedicatedCloud.details.datacenter.details.zerto.drp.configuration',
      {
        url: '/configuration',
        resolve: {
          breadcrumb: () => null,
        },
      },
    )
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp.vra', {
      url: '/vra',
      resolve: {
        breadcrumb: () => null,
      },
    })
    .state('app.dedicatedCloud.details.datacenter.details.zerto.drp.ltr', {
      url: '/ltr',
      resolve: {
        breadcrumb: () => null,
      },
    });
};
