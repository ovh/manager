angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.xdsl.line.access-ip', {
      url: '/ip/:block',
      views: {
        'accessView@telecom.packs.pack.xdsl.line': {
          controller: 'XdslAccessIpCtrl',
          controllerAs: 'XdslAccessIp',
          templateUrl:
            'app/telecom/pack/xdsl/access/ip/pack-xdsl-access-ip.html',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pack_xdsl_access_ip_title'),
      },
      translations: { value: ['./order'], format: 'json' },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
