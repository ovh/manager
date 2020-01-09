import set from 'lodash/set';

import emailproCtrl from './emailpro.controller';
import emailproTpl from './emailpro.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email-pro', {
    url: '/configuration/email_pro/:productId?tab',
    template: emailproTpl,
    controller: emailproCtrl,
    reloadOnSearch: false,
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'email_pro');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
  $stateProvider.state('app.email.mxplan', {
    url: '/configuration/email_mxplan/:productId?tab',
    template: emailproTpl,
    controller: emailproCtrl,
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
        const promise = $state.go('app.email.mxplan', { productId });

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
    },
    translations: {
      value: ['.', 'mailing-list'],
      format: 'json',
    },
  });
};
