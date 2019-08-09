angular.module('UserAccount').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.account.useraccount.contacts.requests', {
    url: '/requests?taskId&token',
    templateUrl: 'account/user/contacts/request/user-contacts-request.html',
    controller: 'UserAccount.controllers.contacts.requests',
    controllerAs: 'ctrlContactRequests',
  });

  // ensure compatibility with links sended by emails
  // like #/useraccount/contacts/1124580?tab=REQUESTS&token=myToken
  // make a redirect to the new url of ui route
  $urlRouterProvider.when(/^\/useraccount\/contacts\/[0-9]+$/, ($location) => {
    const hasToken = _.has($location.search(), 'token');
    const requestTabAsked = _.get($location.search(), 'tab') === 'REQUESTS';

    if (!hasToken || !requestTabAsked) {
      return false;
    }

    const taskId = _.last($location.path().split('/'));
    const token = _.get($location.search(), 'token');

    return `/useraccount/contacts/requests?taskId=${taskId}&token=${token}`;
  });
});
