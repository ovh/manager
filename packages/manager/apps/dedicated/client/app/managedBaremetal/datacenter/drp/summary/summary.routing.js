export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.summary',
    {
      url: '/summary',
      params: {
        zertoInformations: {},
      },
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.summary',
    },
  );
};
