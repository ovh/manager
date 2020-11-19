angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.xdsl.line.missing-rio', {
      url: '/missingRio',
      views: {
        'accessView@telecom.packs.pack.xdsl.line': {
          templateUrl:
            'app/telecom/pack/xdsl/missingRio/pack-xdsl-missing-rio.html',
          controller: 'PackXdslMissingRioCtrl',
          controllerAs: 'PackXdslMissingRio',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('xdsl_missing-rio_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
