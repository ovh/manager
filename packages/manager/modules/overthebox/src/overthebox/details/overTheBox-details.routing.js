export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.details', {
    url: '/details',
    views: {
      otbView: 'overTheBoxDetails',
    },
    translations: {
      value: ['.', '../remote'],
      format: 'json',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
