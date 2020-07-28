export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.actions', {
    url: '/actions',
    views: {
      otbView: 'overTheBoxActions',
    },
  });
};
