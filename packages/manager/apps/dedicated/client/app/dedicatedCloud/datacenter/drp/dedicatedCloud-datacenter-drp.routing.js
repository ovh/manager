export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.details.drp', {
    url: '/drp',
    params: {
      selectedDrpType: null,
    },
    redirectTo: () => {
      return 'app.dedicatedCloud.details.datacenter.details.zerto';
    },
  });
};
