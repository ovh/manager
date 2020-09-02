import get from 'lodash/get';
import head from 'lodash/head';
import 'moment';

import {
  FAQ_LINK,
  AUTO_MIGRATION_CUTOFF_DATE,
} from './vps-migration.constants';
import scheduleComponent from './components/plan/plan.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.migration', {
    url: '/migration',
    redirectTo: (transition) =>
      moment().isAfter(moment(AUTO_MIGRATION_CUTOFF_DATE, 'DD-MM-YYYY'))
        ? transition
            .injector()
            .getAsync('vpsList')
            .then((servers) => ({
              state: 'vps.detail',
              params: {
                serviceName: get(head(servers), 'name'),
              },
            }))
        : false,
    views: {
      'vpsContainer@vps': 'ovhManagerVpsMigration',
    },
    resolve: {
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
      vpsList: /* @ngInject */ (catalog, VpsMigrationService) =>
        VpsMigrationService.getVpsList(catalog),
      faqLink: /* @ngInject */ (user) =>
        get(FAQ_LINK, user.ovhSubsidiary, FAQ_LINK.WORLD),
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_migration_title'),
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
      breadcrumb: () => null,
    },
  });
};
