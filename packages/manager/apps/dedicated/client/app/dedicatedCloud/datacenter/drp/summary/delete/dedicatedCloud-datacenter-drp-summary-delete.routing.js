export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.summary.deleteDrp',
    {
      url: '/deleteDrp',
      layout: 'modal',
      redirectTo: () => {
        return 'app.dedicatedCloud.details.datacenter.details.zerto.summary.deleteZerto';
      },
    },
  );
};
