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
    url: '/:organization/:productId',
    template,
    controller: 'ExchangeCtrl',
    controllerAs: 'ctrl',
    reloadOnSearch: false,
    redirectTo: 'exchange.dashboard.information',
    resolve: {
      organization: /* @ngInject */ ($transition$) =>
        $transition$.params().organization,
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      exchange: /* @ngInject */ (Exchange, organization, productId) =>
        Exchange.getExchangeDetails(organization, productId),
      informationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.information', $transition$.params()),
      domainLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.domain', $transition$.params()),
      accountLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.account', $transition$.params()),
      groupLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.group', $transition$.params()),
      externalContactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'exchange.dashboard.external-contact',
          $transition$.params(),
        ),
      sharedAccountLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.shared-account', $transition$.params()),
      diagnosticLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.diagnostic', $transition$.params()),
      securityLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.security', $transition$.params()),
      resourceLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.resource', $transition$.params()),
      disclaimerLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.disclaimer', $transition$.params()),
      sharedLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.shared', $transition$.params()),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('exchange.dashboard.task', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
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
