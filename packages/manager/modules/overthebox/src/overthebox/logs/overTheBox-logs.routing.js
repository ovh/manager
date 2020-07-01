export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.logs', {
    url: '/logs',
    views: {
      otbView: 'overTheBoxLogs',
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
