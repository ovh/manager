export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain', {
    url: '/:productId?tab',
    templateUrl: 'email-domain/dashboard/email-domain.html',
    controller: 'EmailDomainCtrl',
    controllerAs: 'ctrlEmailDomain',
    reloadOnSearch: false,
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goToEmailDomain: /* @ngInject */ (
        $state,
        $timeout,
        Alerter,
        serviceName,
      ) => (message = false, type = 'success') => {
        const promise = $state.go('app.email.domain', {
          productId: serviceName,
        });

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(`alert-${type}`, message, null, 'domain_alert_main'),
            ),
          );
        }

        return promise;
      },
      currentSection: () => 'email_domain',
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'email_domain';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    redirectTo: (trans) =>
      trans
        .injector()
        .getAsync('WucEmails')
        .then((WucEmails) =>
          WucEmails.getDomain(trans.params().productId).then((data) => {
            if (data.migratedMXPlanServiceName) {
              return {
                state: 'mxplan.dashboard',
                params: {
                  productId: data.migratedMXPlanServiceName,
                },
              };
            }
            return null;
          }),
        ),
    translations: {
      value: ['../email', '../hosting', '../mailing-list'],
      format: 'json',
    },
  });

  $stateProvider.state('app.email-delegate.dashboard', {
    url: '/:productId?tab',
    templateUrl: 'email-domain/delegate/email-domain-delegate.html',
    controller: 'EmailDelegateCtrl',
    controllerAs: 'ctrlEmailDelegate',
    reloadOnSearch: false,
    resolve: {
      currentSection: () => 'email_delegate',
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'email_delegate';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
    },
    translations: { value: ['../email'], format: 'json' },
  });
};
