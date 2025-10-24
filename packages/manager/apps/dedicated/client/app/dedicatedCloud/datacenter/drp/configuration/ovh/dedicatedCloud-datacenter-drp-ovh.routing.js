export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.ovh',
    {
      url: '/ovh',
      abstract: true,
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.ovh.mainPccStep',
    },
  );
};
