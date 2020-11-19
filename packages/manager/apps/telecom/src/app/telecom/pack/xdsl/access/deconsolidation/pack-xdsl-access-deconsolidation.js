angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.packs.pack.xdsl.line.access-deconsolidation',
      {
        url: '/deconsolidation',
        views: {
          'accessView@telecom.packs.pack.xdsl.line': {
            controller: 'XdslDeconsolidationCtrl',
            controllerAs: 'DeconCtrl',
            templateUrl:
              'app/telecom/pack/xdsl/access/deconsolidation/pack-xdsl-access-deconsolidation.html',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('xdsl_access_deconsolidation_title'),
        },
        translations: { value: ['./contract'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
