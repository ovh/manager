import template from './user-agreements.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlServiceProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    $stateProvider.state('app.account.billing.autorenew.agreements', {
      url: '/agreements',
      template,
      controller: 'UserAccount.controllers.agreements',
      translations: { value: ['.'], format: 'json' },
      resolve: {
        gotoAcceptAllAgreements: /* @ngInject */ ($state, atInternet) => (
          agreements,
        ) => {
          atInternet.trackClick({
            name:
              'dedicated::account::billing::autorenew::agreements::go-to-accept-all',
            type: 'action',
          });
          return $state.go(
            'app.account.billing.autorenew.agreements.popup-agreement',
            {
              agreements,
            },
          );
        },
      },
    });

    // ensure compatibility with links sended by emails
    // like #/useraccount/agreements or #/useraccount/agreements/123456/details
    // make a redirect to the new url of ui route
    $urlServiceProvider.rules.when(
      '/useraccount/agreements',
      '/billing/autorenew/agreements',
    );
    $urlServiceProvider.rules.when(
      '/billing/agreements',
      '/billing/autorenew/agreements',
    );
  }
};
