export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.logs', {
    url: '/logs',
    views: {
      otbView: 'overTheBoxLogs',
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
};
