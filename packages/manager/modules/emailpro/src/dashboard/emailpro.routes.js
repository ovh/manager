import set from 'lodash/set';

import emailproCtrl from './emailpro.controller';
import emailproTpl from './emailpro.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard', {
    url: '/:productId',
    template: emailproTpl,
    controller: emailproCtrl,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    redirectTo: (transition) => {
      const EmailPro = transition.injector().get('EmailPro');
      const productId = transition.injector().getAsync('productId');
      return productId.then((serviceName) =>
        EmailPro.getSelected(true, serviceName).then((exchange) =>
          exchange.domainsNumber
            ? 'email-pro.dashboard.information'
            : 'email-pro.dashboard.domain.add',
        ),
      );
    },
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'email_pro');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      informationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('email-pro.dashboard.information', $transition$.params()),
      domainLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('email-pro.dashboard.domain', $transition$.params()),
      accountLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('email-pro.dashboard.account', $transition$.params()),
      externalContactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'email-pro.dashboard.external-contact',
          $transition$.params(),
        ),
      disclaimerLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('email-pro.dashboard.disclaimer', $transition$.params()),
      // TODO: Replace with Feature flipping
      taskLink: /* @ngInject */ ($state, $transition$, coreConfig) =>
        coreConfig.isRegion('EU')
          ? $state.href('email-pro.dashboard.task', $transition$.params())
          : null,
      mailingListLink: () => null,
      redirectionLink: () => null,

      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),

      breadcrumb: /* @ngInject */ (productId) => productId,
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
  $stateProvider.state('mxplan.dashboard', {
    url: '/:productId',
    template: emailproTpl,
    controller: emailproCtrl,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
    redirectTo: 'mxplan.dashboard.information',
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'email_mxplan');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      productId: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goToEmailPro: /* @ngInject */ ($state, $timeout, Alerter, productId) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('mxplan.dashboard', { productId });

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'emailproDashboardAlert',
              ),
            ),
          );
        }

        return promise;
      },

      informationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('mxplan.dashboard.information', $transition$.params()),
      domainLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('mxplan.dashboard.domain', $transition$.params()),
      accountLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('mxplan.dashboard.account', $transition$.params()),
      externalContactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('mxplan.dashboard.external-contact', $transition$.params()),
      disclaimerLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('mxplan.dashboard.disclaimer', $transition$.params()),
      // TODO: Replace with Feature flipping
      taskLink: /* @ngInject */ ($state, $transition$, coreConfig) =>
        coreConfig.isRegion('EU')
          ? $state.href('mxplan.dashboard.task', $transition$.params())
          : null,
      mailingListLink: /* @ngInject */ ($state, $transition$, coreConfig) =>
        coreConfig.isRegion('EU')
          ? $state.href('mxplan.dashboard.mailing-list', $transition$.params())
          : null,
      redirectionLink: /* @ngInject */ ($state, $transition$, coreConfig) =>
        coreConfig.isRegion('EU')
          ? $state.href('mxplan.dashboard.redirection', $transition$.params())
          : null,

      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),

      breadcrumb: /* @ngInject */ (productId) => productId,
    },
    translations: {
      value: ['.', '../mailing-list'],
      format: 'json',
    },
  });
};
