import scheduleComponent from './components/plan/plan.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.migration', {
    url: '/migration',
    views: {
      'vpsContainer@vps': 'ovhManagerVpsMigration',
    },
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      vpsList: /* @ngInject */ (VpsMigrationService) =>
        VpsMigrationService.getVpsList(),
      getMigrationDetails: /* @ngInject */ (catalog, VpsMigrationService) => (
        serviceName,
      ) => VpsMigrationService.getMigrationDetails(serviceName, catalog),
      catalog: /* @ngInject */ (user, VpsService) =>
        VpsService.getCatalog(user.ovhSubsidiary),
      vpsDetailsPage: /* @ngInject */ ($state) => (serviceName) =>
        $state.go('vps.detail', {
          serviceName,
        }),
      schedulePage: /* @ngInject */ ($state) => (servers) =>
        $state.go('vps.migration.schedule', { servers }),
    },
  });
  $stateProvider.state('vps.migration.schedule', {
    url: '/schedule',
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
                state: 'vps.migration',
              },
        ),
    params: { servers: null },
    resolve: {
      servers: /* @ngInject */ ($transition$) => $transition$.params().servers,
      goBack: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const state = 'vps.migration';
        const reload = !!message;
        const promise = $state.go(state, null, { reload });
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
