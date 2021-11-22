import controller from './email-domain-delegate.controller';
import template from './email-domain-delegate.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email-delegate.dashboard', {
    url: '/:productId',
    template,
    controller,
    controllerAs: 'ctrlEmailDelegate',
    reloadOnSearch: false,
    resolve: {
      currentSection: () => 'email_delegate',
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        // eslint-disable-next-line no-param-reassign
        $rootScope.currentSectionInformation = 'email_delegate';
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },
      goToDelegations: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.email-delegate.dashboard', $transition$.params),
      goToFilters: /* @ngInject */ ($state, $transition$) => (email, emails) =>
        $state.go('app.email-delegate.dashboard.account.filter', {
          ...$transition$.params,
          email,
          emails,
          accountName: email.accountName,
        }),
      goToResponder: /* @ngInject */ ($state, $transition$) => () =>
        $state.go(
          'app.email-delegate.dashboard.responder',
          $transition$.params,
        ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
    translations: { value: ['../dashboard'], format: 'json' },
  });

  $stateProvider.state('app.email-delegate.dashboard.account', {
    url: '/:accountName',
    template: '<div ui-view></div>',
    redirectTo: 'app.email-delegate.dashboard',
    resolve: {
      accountName: /* @ngInject */ ($transition$) =>
        $transition$.params().accountName,
      breadcrumb: /* @ngInject */ (accountName) => accountName,
    },
  });
};
