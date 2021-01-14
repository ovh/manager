import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';

angular
  .module('UserAccount')
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state('app.account.contacts.requests', {
      url: '/requests?taskId&token',
      templateUrl: 'account/contacts/request/user-contacts-request.html',
      controller: 'UserAccount.controllers.contacts.requests',
      controllerAs: 'ctrlContactRequests',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('user_account_contacts_request'),
      },
    });

    // ensure compatibility with links sended by emails
    // like #/useraccount/contacts/1124580?tab=REQUESTS&token=myToken
    // make a redirect to the new url of ui route
    $urlRouterProvider.when(
      /^\/useraccount\/contacts\/[0-9]+$/,
      ($location, $state) => {
        const hasToken = has($location.search(), 'token');
        const requestTabAsked = get($location.search(), 'tab') === 'REQUESTS';

        if (!hasToken || !requestTabAsked) {
          return false;
        }

        const taskId = last($location.path().split('/'));
        const token = get($location.search(), 'token');

        return $state.go('app.account.contacts.requests', { taskId, token });
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
