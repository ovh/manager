import set from 'lodash/set';

import sharepointCtrl from './sharepoint.controller';
import orderCtrl from '../order/sharepoint-order.controller';
import urlCtrl from '../url/sharepoint-url.controller';

import sharepointTpl from './sharepoint.html';
import sharepointOrderTpl from '../order/sharepoint-order.html';
import sharepointUrlTpl from '../url/sharepoint-url.html';

const routeBase = 'sharepoint';

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

  $stateProvider.state(`${routeBase}.order`, {
    url: '/order',
    template: sharepointOrderTpl,
    reloadOnSearch: false,
    resolve,
  });

  $stateProvider.state(`${routeBase}.config`, {
    url: '/activate/:organizationId/:exchangeId',
    template: sharepointOrderTpl,
    controller: orderCtrl,
    controllerAs: 'SharepointOrderCtrl',
    reloadOnSearch: false,
    resolve,
  });

  $stateProvider.state(`${routeBase}.product`, {
    url: '/:exchangeId/:productId?tab',
    template: sharepointTpl,
    controller: sharepointCtrl,
    controllerAs: 'SharepointCtrl',
    reloadOnSearch: false,
    params: {
      tab: null,
    },
    resolve,
  });

  $stateProvider.state(`${routeBase}.product.setUrl`, {
    url: '/setUrl',
    template: sharepointUrlTpl,
    controller: urlCtrl,
    controllerAs: 'SharepointUrlCtrl',
    reloadOnSearch: false,
    resolve,
  });
};
