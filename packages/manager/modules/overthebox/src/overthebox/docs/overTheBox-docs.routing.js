export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.docs', {
    url: '/docs',
    views: {
      otbView: 'overTheBoxDocs',
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
