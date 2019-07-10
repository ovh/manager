angular.module('Module.sharepoint', [
  'ovh-utils-angular',
  'ngRoute',
  'ui.bootstrap',
  'ngSanitize',
  'Module.sharepoint.controllers',
  'Module.sharepoint.services',
  'ovh-api-services',
]).config([
  '$stateProvider', ($stateProvider) => {
    const resolve = {
      navigationInformations: /* @ngInject */['Navigator', '$rootScope', (Navigator, $rootScope) => {
        _.set($rootScope, 'currentSectionInformation', 'sharepoint');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      }],
    };

    $stateProvider.state('app.microsoft.sharepoint', {
      abstract: true,
      template: '<div ui-view></div>',
      translations: ['.'],
    });

    $stateProvider.state('app.microsoft.sharepoint.order', {
      url: '/configuration/microsoft/sharepoint/order',
      templateUrl: 'sharepoint/order/sharepoint-order.html',
      reloadOnSearch: false,
      resolve,
    });

    $stateProvider.state('app.microsoft.sharepoint.config', {
      url: '/configuration/sharepoint/activate/:organizationId/:exchangeId',
      templateUrl: 'sharepoint/order/sharepoint-order.html',
      controller: 'SharepointOrderCtrl',
      controllerAs: 'SharepointOrderCtrl',
      reloadOnSearch: false,
      resolve,
    });

    $stateProvider.state('app.microsoft.sharepoint.product', {
      url: '/configuration/sharepoint/:exchangeId/:productId?tab',
      templateUrl: 'sharepoint/sharepoint.html',
      controller: 'SharepointCtrl',
      controllerAs: 'SharepointCtrl',
      reloadOnSearch: false,
      params: {
        tab: null,
      },
      resolve,
    });

    $stateProvider.state('app.microsoft.sharepoint.setUrl', {
      url: '/configuration/sharepoint/:exchangeId/:productId/setUrl',
      templateUrl: 'sharepoint/url/sharepoint-url.html',
      controller: 'SharepointUrlCtrl',
      controllerAs: 'SharepointUrlCtrl',
      reloadOnSearch: false,
      resolve,
    });
  },
])
  .constant('SHAREPOINT_GUIDE_URLS', {
    CZ: '',
    DE: 'https://www.ovh.de/g2249.aktivierung_und_verwaltung_ihres_ovh_sharepoint',
    ES: 'https://www.ovh.es/g2249.activacion_y_gestion_de_un_sharepoint_ovh',
    FI: 'https://www.ovh-hosting.fi/g2249.ovhn_sharepoint-hallintaliittyman_aktivointi',
    FR: 'https://docs.ovh.com/fr/fr/web/microsoft-collaborative-solutions/activation-et-gestion-de-votre-sharepoint-ovh/',
    GB: 'https://www.ovh.co.uk/g2249.enable_and_manage_your_ovh_sharepoint',
    IT: '',
    LT: 'https://www.ovh.lt/g2249.ovh_sharepoint_ijungimas_ir_valdymas',
    NL: '',
    PL: 'https://www.ovh.pl/g2249.aktywacja_uslugi_sharepoint_ovh_i_zarzadzanie_nia',
    PT: 'https://www.ovh.pt/g2249.ativacao_e_gestao_do_seu_sharepoint_ovh',
    CA: 'https://www.ovh.com/ca/en/g2249.enable_and_manage_your_ovh_sharepoint',
    QC: 'https://www.ovh.com/ca/fr/g2249.activation_et_gestion_de_votre_sharepoint_ovh',
    US: 'https://www.ovh.com/us/g2249.enable_and_manage_your_ovh_sharepoint',
  });
