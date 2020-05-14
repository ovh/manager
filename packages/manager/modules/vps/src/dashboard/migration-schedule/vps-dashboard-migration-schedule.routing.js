import scheduleComponent from '../../migration/components/plan/plan.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.schedule', {
    url: '/migration/schedule',
    component: scheduleComponent.name,
    translations: {
      value: ['.'],
      format: 'json',
    },
    layout: 'modal',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('servers')
        .then((servers) =>
          servers && servers.length > 0
            ? false
            : {
                state: 'vps.detail.dashboard',
              },
        ),
    params: { servers: null },
    resolve: {
      servers: /* @ngInject */ ($transition$) => $transition$.params().servers,
      goBack: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const state = 'vps.detail.dashboard';
        const reload = !!message;
        const promise = $state.go(state, null, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
      user: /* @ngInject */ (currentUser) => currentUser,
    },
  });
};
