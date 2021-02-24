export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('overTheBoxes.overTheBox.docs', {
    url: '/docs',
    views: {
      otbView: 'overTheBoxDocs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('overTheBox_docs_title'),
    },
  });
};
