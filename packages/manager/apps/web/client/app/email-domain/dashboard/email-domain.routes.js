import controller from './email-domain.controller';
import template from './email-domain.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain', {
    url: '/:productId',
    template,
    controller,
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
      informationLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.email.domain.information', $transition$.params()),
      emailLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.email.domain.email', $transition$.params()),
      mailingListLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.email.domain.mailing-list', $transition$.params()),
      taskLink: /* @ngInject */ ($state, $transition$) =>
        $state.href('app.email.domain.task', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),

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
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
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
            return 'app.email.domain.information';
          }),
        ),
    translations: {
      value: ['../email', '../hosting', '../mailing-list'],
      format: 'json',
    },
  });
};
