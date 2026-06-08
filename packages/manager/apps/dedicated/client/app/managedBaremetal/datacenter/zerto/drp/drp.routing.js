export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.managedBaremetal.details.datacenters.datacenter.zerto.drp', {
      url: '/drp',
      views: {
        'pccDatacenterView@app.managedBaremetal.details.datacenters.datacenter': {
          component: 'dedicatedCloudDatacenterZertoDrp',
        },
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.configuration',
      resolve: {
        breadcrumb: () => null,
        configurationState: () =>
          'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.configuration',
        vraState: () =>
          'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.vra',
        ltrState: () =>
          'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.ltr',
      },
    })
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.configuration',
      {
        url: '/configuration',
        resolve: {
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.vra',
      {
        url: '/vra',
        resolve: {
          breadcrumb: () => null,
        },
      },
    )
    .state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.drp.ltr',
      {
        url: '/ltr',
        resolve: {
          breadcrumb: () => null,
        },
      },
    );
};
