export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.drp.onPremise',
    {
      url: '/onPremise',
      abstract: true,
      redirectTo:
        'app.dedicatedCloud.details.datacenter.details.zerto.onPremise.ovhPccStep',
    },
  );
};
