import set from 'lodash/set';

const routeBase = 'app.microsoft.sharepoint';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
      set($rootScope, 'currentSectionInformation', 'sharepoint');
      return Navigator.setNavigationInformation({
        leftMenuVisible: true,
        configurationSelected: true,
      });
    },
  };

  $stateProvider.state(routeBase, {
    abstract: true,
    template: '<div ui-view></div>',
    translations: ['.'],
  });

  $stateProvider.state(`${routeBase}.order`, {
    url: '/configuration/microsoft/sharepoint/order',
    templateUrl: 'sharepoint/order/sharepoint-order.html',
    reloadOnSearch: false,
    resolve,
  });

  $stateProvider.state(`${routeBase}.config`, {
    url: '/configuration/sharepoint/activate/:organizationId/:exchangeId',
    templateUrl: 'sharepoint/order/sharepoint-order.html',
    controller: 'SharepointOrderCtrl',
    controllerAs: 'SharepointOrderCtrl',
    reloadOnSearch: false,
    resolve,
  });

  $stateProvider.state(`${routeBase}.product`, {
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

  $stateProvider.state(`${routeBase}.setUrl`, {
    url: '/configuration/sharepoint/:exchangeId/:productId/setUrl',
    templateUrl: 'sharepoint/url/sharepoint-url.html',
    controller: 'SharepointUrlCtrl',
    controllerAs: 'SharepointUrlCtrl',
    reloadOnSearch: false,
    resolve,
  });
};
