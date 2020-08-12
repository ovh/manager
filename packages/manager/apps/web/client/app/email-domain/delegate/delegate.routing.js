import template from './email-domain-delegate.html';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.email-delegate.dashboard', {
    url: '/:productId',
    template,
    controller: 'EmailDelegateCtrl',
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
        $state.go('app.email-delegate.dashboard.filter', {
          ...$transition$.params,
          email,
          emails,
        }),
      goToResponder: /* @ngInject */ ($state, $transition$) => () =>
        $state.go(
          'app.email-delegate.dashboard.responder',
          $transition$.params,
        ),
    },
    translations: { value: ['../dashboard'], format: 'json' },
  });
