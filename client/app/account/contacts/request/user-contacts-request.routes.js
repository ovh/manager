angular.module('UserAccount').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.account.contacts.requests', {
    url: '/requests?taskId&token',
    templateUrl: 'account/contacts/request/user-contacts-request.html',
    controller: 'UserAccount.controllers.contacts.requests',
    controllerAs: 'ctrlContactRequests',
  });

  // ensure compatibility with links sended by emails
  // like #/useraccount/contacts/1124580?tab=REQUESTS&token=myToken
  // make a redirect to the new url of ui route
  $urlRouterProvider.when(/^\/useraccount\/contacts\/[0-9]+$/, ($location, $state) => {
    const hasToken = _.has($location.search(), 'token');
    const requestTabAsked = _.get($location.search(), 'tab') === 'REQUESTS';

    if (!hasToken || !requestTabAsked) {
      return false;
    }

    const taskId = _.last($location.path().split('/'));
    const token = _.get($location.search(), 'token');

    return $state.go('app.account.contacts.requests', { taskId, token });
  });
});
