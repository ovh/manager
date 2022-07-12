import {
  NASHA_ALERT_ID,
  NASHA_BASE_API_URL,
  NASHA_TITLE,
} from './nasha.constants';
import {
  formatAclTypeEnum,
  formatProtocolEnum,
  formatRecordsizeEnum,
  formatSnapshotEnum,
  formatSyncEnum,
  prepareNasha,
  preparePartition,
  preparePlans,
  prepareZfsOptions,
} from './nasha.utils';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    template: `
      <div class="nasha">
          <div data-ovh-alert="${NASHA_ALERT_ID}"></div>
          <div data-ui-view></div>
      </div>
    `,
    redirectTo: (transition) =>
      transition
        .injector()
        .get('iceberg')(NASHA_BASE_API_URL)
        .query()
        .expand('CachedObjectList-Pages')
        .limit(1)
        .execute(null, true)
        .$promise.then(({ data }) =>
          data.length ? 'nasha.directory' : 'nasha.onboarding',
        ),
    resolve: {
      // GLOBALS
      baseApiUrl: () => NASHA_BASE_API_URL,
      breadcrumb: () => NASHA_TITLE,
      schema: /* @ngInject */ ($http, baseApiUrl) =>
        $http.get(`${baseApiUrl}.json`).then(({ data }) => data),

      // ALERTS
      alert: /* @ngInject */ (Alerter) => (type, message) =>
        Alerter[type](message, NASHA_ALERT_ID),
      alertError: /* @ngInject */ (alert, $translate) => (error) => {
        const message =
          error.data?.message || error.message || error.toString();
        alert('error', $translate.instant('nasha_error', { message }));
      },
      alertSuccess: /* @ngInject */ (alert) => (message) =>
        alert('success', message),

      // ENUMS
      aclTypeEnum: (schema, $translate) =>
        formatAclTypeEnum(schema, $translate),
      protocolEnum: /* @ngInject */ (schema) => formatProtocolEnum(schema),
      recordsizeEnum: /* @ngInject */ (schema, $filter) =>
        formatRecordsizeEnum(schema, $filter('bytes')),
      snapshotEnum: /* @ngInject */ (schema, $translate) =>
        formatSnapshotEnum(schema, $translate),
      syncEnum: /* @ngInject */ (schema) => formatSyncEnum(schema),

      // PREPARES
      prepareNasha: /* @ngInject */ ($translate) => (nasha) =>
        prepareNasha(nasha, $translate),
      preparePartition: /* @ngInject */ ($translate) => (partition) =>
        preparePartition(partition, $translate),
      preparePlans: /* @ngInject */ ($filter) => (catalog) =>
        preparePlans(catalog, $filter),
      prepareZfsOptions: () => prepareZfsOptions,
    },
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
