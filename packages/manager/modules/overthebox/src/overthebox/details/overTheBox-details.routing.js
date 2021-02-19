export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.details', {
    url: '/details',
    views: {
      otbView: 'overTheBoxDetails',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
