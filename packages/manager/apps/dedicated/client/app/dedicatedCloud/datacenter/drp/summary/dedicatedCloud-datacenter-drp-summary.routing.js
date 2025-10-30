export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.summary',
    {
      url: '/summary',
      params: {
        drpInformations: {},
      },
      redirectTo: () => {
        return 'app.dedicatedCloud.details.datacenter.details.zerto.summary';
      },
    },
  );
};
