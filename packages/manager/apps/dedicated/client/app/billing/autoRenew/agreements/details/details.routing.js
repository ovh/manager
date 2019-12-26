import template from './user-agreements-details.html';

export default /* @ngInject */ (
  $stateProvider,
  $urlServiceProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    $stateProvider.state('app.account.billing.autorenew.agreements.agreement', {
      url: '/details/:id',
      template,
      controller: 'UserAccount.controllers.agreements.details',
      controllerAs: 'ctrl',
    });

    // ensure compatibility with links sended by emails
    // like #/useraccount/agreements or #/useraccount/agreements/123456/details
    // make a redirect to the new url of ui route
    $urlServiceProvider.rules.when(
      '/useraccount/agreements/:id/details',
      '/billing/agreements/details/:id',
    );
  }
};
