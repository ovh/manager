export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.details', {
    url: '/details',
    views: {
      otbView: 'overTheBoxDetails',
    },
    resolve: {
      changeOffer: /* @ngInject */ ($state) => () =>
        $state.go('overTheBoxes.overTheBox.migration'),
      breadcrumb: () => null,
    },
  });
};
