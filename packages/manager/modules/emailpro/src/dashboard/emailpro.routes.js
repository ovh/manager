import set from 'lodash/set';

import emailproCtrl from './emailpro.controller';
import emailproTpl from './emailpro.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard', {
    url: '/:productId?tab',
    template: emailproTpl,
    controller: emailproCtrl,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
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
      getTabLink: /* @ngInject */ ($state, productId) => (tab) =>
        $state.href('email-pro.dashboard', { productId, tab }),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
  $stateProvider.state('mxplan.dashboard', {
    url: '/:productId?tab',
    template: emailproTpl,
    controller: emailproCtrl,
    controllerAs: '$ctrl',
    reloadOnSearch: false,
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
      getTabLink: /* @ngInject */ ($state, productId) => (tab) =>
        $state.href('mxplan.dashboard', { productId, tab }),
    },
    translations: {
      value: ['.', '../mailing-list'],
      format: 'json',
    },
  });
};
