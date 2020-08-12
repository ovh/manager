import set from 'lodash/set';

import template from './exchange.html';
import orderTemplate from '../order/order.html';

export default /* @ngInject */ ($stateProvider) => {
  const getNavigationInformations = (
    currentSectionInformation,
  ) => /* @ngInject */ (Navigator, $rootScope) => {
    set($rootScope, 'currentSectionInformation', currentSectionInformation);
    return Navigator.setNavigationInformation({
      leftMenuVisible: true,
      configurationSelected: true,
    });
  };

  $stateProvider.state('exchange.dashboard', {
    url: '/:organization/:productId?tab',
    template,
    controller: 'ExchangeCtrl',
    controllerAs: 'ctrl',
    reloadOnSearch: false,
    params: {
      tab: null,
    },
    resolve: {
      organization: /* @ngInject */ ($transition$) =>
        $transition$.params().organization,
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      exchange: /* @ngInject */ (Exchange, organization, productId) =>
        Exchange.getExchangeDetails(organization, productId),
    },
  });

  $stateProvider.state('exchange.order', {
    url: '/order',
    template: orderTemplate,
    controller: 'ExchangeOrderCtrl',
    controllerAs: 'ctrl',
    reloadOnSearch: false,
    resolve: {
      navigationInformations: getNavigationInformations('exchange_order'),
    },
  });
};
