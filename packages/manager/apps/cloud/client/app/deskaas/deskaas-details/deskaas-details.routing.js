export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('deskaas.details', {
    url: '/:serviceName?action&token',
    params: {
      action: null,
      token: null,
      followTask: null,
    },
    component: 'deskaasDetailsComponent',
    resolve: {
      action: /* @ngInject */ $transition$ => $transition$.params().action,
      followTask: /* @ngInject */ $transition$ => $transition$.params().followTask,
      serviceName: /* @ngInject */ $transition$ => $transition$.params().serviceName,
      token: /* @ngInject */ $transition$ => $transition$.params().token,
      goToChangePassword: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('deskaas.details.change-password', { serviceName }),
      goToConsoleAccess: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('deskaas.details.get-console-access', { serviceName }),
      removeConfirmationParams: /* @ngInject */ ($location) => () => {
        if ($location.$$search.action) {
          delete $location.$$search.action; // eslint-disable-line
        }
        if ($location.$$search.token) {
          delete $location.$$search.token; // eslint-disable-line
        }
        // Do not reload url
        $location.$$compose();
      },
      goToConfirmTerminate: /* @ngInject */
        ($state, serviceName, token) => () => $state.go('deskaas.details.confirm-terminate', { serviceName, token }),
      goBackToDetails: /* @ngInject */ ($state, CucCloudMessage, removeConfirmationParams) => (message = false,
        type = 'success', data, removeParams) => {
        const state = 'deskaas.details';
        const promise = $state.go(state, data);
        if(removeParams) {
          promise.then(() => removeConfirmationParams());
        }
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
    },
  });
};
