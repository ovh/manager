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
    hideBreadcrumb: () => true,
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
    url: '/:exchangeId/:productId',
    template: sharepointTpl,
    controller: sharepointCtrl,
    controllerAs: 'SharepointCtrl',
    reloadOnSearch: false,
    redirectTo: 'sharepoint.product.information',
    resolve: {
      ...resolve,
      exchangeId: /* @ngInject */ ($transition$) =>
        $transition$.params().exchangeId,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      informationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('sharepoint.product.information', $transition$.params()),
      accountLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('sharepoint.product.account', $transition$.params()),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('sharepoint.product.task', $transition$.params()),
      domainLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('sharepoint.product.domain', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),

      associatedExchange: /* @ngInject */ (
        exchangeId,
        MicrosoftSharepointLicenseService,
      ) =>
        MicrosoftSharepointLicenseService.getAssociatedExchangeService(
          exchangeId,
        ).catch(() => null),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
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
