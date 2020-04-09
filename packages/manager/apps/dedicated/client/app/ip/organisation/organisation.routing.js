import has from 'lodash/has';
import isString from 'lodash/isString';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.organisation', {
    url: '/organisation',
    resolve: {
      goToAdd: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.organisation.add', params, transitionParams),
      goToDashboard: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.dashboard', params, transitionParams),
      goToEdit: /* @ngInject */ ($state) => (params, transitionParams) =>
        $state.go('app.ip.organisation.edit', params, transitionParams),
      goToOrganisation: /* @ngInject */ ($state, Alerter) => (
        params = {},
        transitionParams,
      ) => {
        const promise = $state.go(
          'app.ip.organisation',
          params,
          transitionParams,
        );

        const { message } = params;
        if (message) {
          // Alerter.alertFromSWS expects either data.message, data.messages or a String
          let typeToUse;

          if (isString(message.data)) {
            typeToUse = message.data;
          } else if (
            has(message.data, 'message') ||
            has(message.data, 'messages')
          ) {
            typeToUse = message.data;
          } else {
            typeToUse = message.data.type;
          }

          promise.then(() => {
            Alerter.alertFromSWS(
              message.text,
              typeToUse,
              message.id || 'app.ip',
            );
          });
        }

        return promise;
      },
    },
    views: {
      ip: 'ipOrganisation',
    },
  });
};
