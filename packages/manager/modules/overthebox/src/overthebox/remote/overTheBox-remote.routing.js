export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.remote', {
    url: '/remote',
    views: {
      otbView: 'overTheBoxRemote',
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
