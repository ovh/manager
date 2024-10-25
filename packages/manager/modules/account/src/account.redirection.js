import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
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

      return $state.go('account.contacts.requests', { taskId, token });
    },
  );

  $urlRouterProvider.when(/^\/useraccount\/contacts/, ($location, $state) =>
    $state.go('account.contacts.services', $location.search()),
  );

  $urlRouterProvider.when(/^\/useraccount\/contact\//, ($location) =>
    $location.url($location.url().replace('/useraccount', '')),
  );
};
