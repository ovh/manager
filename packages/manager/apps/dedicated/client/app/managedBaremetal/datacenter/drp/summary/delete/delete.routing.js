export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.drp.summary.deleteDrp',
    {
      url: '/deleteDrp',
      layout: 'modal',
      redirectTo:
        'app.managedBaremetal.details.datacenters.datacenter.zerto.summary.deleteZerto',
    },
  );
};
