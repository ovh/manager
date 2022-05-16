import {
  NASHA_ALERT_ID,
  NASHA_BASE_API_URL,
  NASHA_TITLE,
} from './nasha.constants';
import {
  exportZfsOptions,
  localizeDatacenter,
  localizeOperation,
  formatProtocolEnum,
  formatRecordsizeEnum,
  formatSyncEnum,
  prepareNasha,
  preparePartition,
  preparePartitionSnapshots,
  prepareTasks,
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
      alert: /* @ngInject */ (Alerter) => (type, message) =>
        Alerter[type](message, NASHA_ALERT_ID),
      alertSuccess: /* @ngInject */ (alert) => (message) =>
        alert('success', message),
      alertError: /* @ngInject */ (alert, $translate) => (error) => {
        const message =
          error.data?.message || error.message || error.toString();
        alert('error', $translate.instant('nasha_error', { message }));
      },
      baseApiUrl: () => NASHA_BASE_API_URL,
      breadcrumb: () => NASHA_TITLE,
      exportZfsOptions: () => exportZfsOptions,
      localizeDatacenter: /* @ngInject */ ($translate) => (datacenter) =>
        localizeDatacenter(datacenter, $translate),
      localizeOperation: /* @ngInject */ ($translate) => (operation) =>
        localizeOperation(operation, $translate),
      prepareNasha: /* @ngInject */ ($translate) => (nasha) =>
        prepareNasha(nasha, $translate),
      preparePartition: /* @ngInject */ ($translate) => (partition) =>
        preparePartition(partition, $translate),
      preparePartitionSnapshots: /* @ngInject */ ($translate) => (
        partition,
        snapshots,
        customSnapshots,
        SnapshotEnum,
        tasks,
      ) =>
        preparePartitionSnapshots(
          partition,
          snapshots,
          customSnapshots,
          SnapshotEnum,
          tasks,
          $translate,
        ),
      prepareTasks: /* @ngInject */ ($translate) => (tasks) =>
        prepareTasks(tasks, $translate),
      prepareZfsOptions: () => prepareZfsOptions,
      protocolEnum: /* @ngInject */ (schema) => formatProtocolEnum(schema),
      recordsizeEnum: /* @ngInject */ (schema, $filter) =>
        formatRecordsizeEnum(schema, $filter('bytes')),
      schema: /* @ngInject */ ($http, baseApiUrl) =>
        $http.get(`${baseApiUrl}.json`).then(({ data }) => data),
      syncEnum: /* @ngInject */ (schema) => formatSyncEnum(schema),
      trackingPrefix: () => NASHA_TITLE,
    },
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
