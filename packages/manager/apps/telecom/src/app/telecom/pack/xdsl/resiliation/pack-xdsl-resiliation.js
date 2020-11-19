angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.xdsl.line.access-resiliation', {
      url: '/resiliation',
      views: {
        'accessView@telecom.packs.pack.xdsl.line': {
          templateUrl:
            'app/telecom/pack/xdsl/resiliation/pack-xdsl-resiliation.html',
          controller: 'PackXdslResiliationCtrl',
          controllerAs: 'PackXdslResiliation',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('xdsl_resiliation_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
