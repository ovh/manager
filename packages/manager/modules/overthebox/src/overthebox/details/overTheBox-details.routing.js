export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.details', {
    url: '/details',
    views: {
      otbView: 'overTheBoxDetails',
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
    },
  });
};
