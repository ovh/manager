import Snapshot from './Snapshot.class';
import {
  SNAPSHOT_TYPE,
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
} from './constants';
import { formatValueToBestUnit } from '../utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots', {
    url: '/snapshots',
    component: 'ovhManagerNetAppVolumesDashboardSnapshots',
    resolve: {
      trackCreate: /* @ngInject */ (atInternet) => () =>
        atInternet.trackClick({
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}page::button::add-snapshot`,
        }),
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          type: 'action',
          page_category: 'popup',
          name: `${SNAPSHOT_TRACKING_PREFIX}button::add_snapshot::${tracker}`,
          page: {
            name: `${SNAPSHOT_TRACKING_PREFIX}netapp::popup::add::snapshot`,
          },
        }),
      addSnapshotLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'netapp.dashboard.volumes.dashboard.snapshots.add',
          $transition$.params(),
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_snapshots_breadcrumb'),

      /* @ngInject */
      deleteSnapshot: (atInternet, $state, serviceName, volumeId) => (
        snapshotId,
      ) => {
        atInternet.trackClick({
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}datagrid::button::delete::volumes`,
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          page_category: 'listing',
        });

        return $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots.delete',
          {
            serviceName,
            volumeId,
            snapshotId,
          },
        );
      },

      /* @ngInject */
      editSnapshot: (atInternet, $state, serviceName, volumeId) => (
        snapshotId,
      ) => {
        atInternet.trackClick({
          type: 'action',
          name: `${SNAPSHOT_TRACKING_PREFIX}datagrid::button::edit::volumes`,
          ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
          page_category: 'listing',
        });

        return $state.go('netapp.dashboard.volumes.dashboard.snapshots.edit', {
          serviceName,
          volumeId,
          snapshotId,
        });
      },
      canCreateVolumeFromSnapshot: (
        volume,
        isCreateVolumeAvailable,
        availableVolumeSize,
      ) => isCreateVolumeAvailable && volume.size < availableVolumeSize,
      /* @ngInject */
      createVolumeFromSnapshot: ($state, serviceName, volumeId) => (
        snapshotId,
      ) =>
        $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots.create-volume',
          {
            serviceName,
            volumeId,
            snapshotId,
          },
        ),
      /* @ngInject */
      goToSnapshots: ($state, Alerter, serviceName, volumeId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'netapp.dashboard.volumes.dashboard.snapshots',
          {
            serviceName,
            volumeId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            Alerter[type](message);
          });
        }

        return promise;
      },

      snapshots: /* @ngInject */ ($http, $q, serviceName, volumeId) =>
        $q
          .all([
            $http.get(
              `/storage/netapp/${serviceName}/share/${volumeId}/snapshot?detail=true`,
            ),
            $http.get(`/storage/netapp/${serviceName}/metricsToken`),
          ])
          .then(
            ([
              { data: snapshots },
              {
                data: { endpoint, token },
              },
            ]) => {
              // eslint-disable-next-line no-useless-escape
              const QUERY = `\{__name__=~"snapshot_size",service_id="${serviceName}",share_id="${volumeId}"\}`;
              return $http
                .get(`${endpoint}/prometheus/api/v1/query?query=${QUERY}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then(
                  ({
                    data: {
                      data: { result },
                    },
                  }) => {
                    const snapshotSizes = result.reduce(
                      (prev, { metric: { snapshot }, value }) => ({
                        ...prev,
                        [snapshot]:
                          value?.[1] && formatValueToBestUnit(value[1]),
                      }),
                      {},
                    );

                    return snapshots.map(
                      (snapshot) =>
                        new Snapshot({
                          ...snapshot,
                          size: snapshotSizes[snapshot.path.split('/').at(-1)],
                        }),
                    );
                  },
                )
                .catch(() =>
                  snapshots.map((snapshot) => new Snapshot(snapshot)),
                );
            },
          ),

      hasOnlySystemSnapshot: /* @ngInject */ (snapshots) =>
        !snapshots.find(
          (snapshot) =>
            snapshot.type === SNAPSHOT_TYPE.AUTOMATIC ||
            snapshot.type === SNAPSHOT_TYPE.MANUAL,
        ),
      totalSnapshots: /* @ngInject */ ($http, $q, serviceName) =>
        $http
          .get(`/storage/netapp/${serviceName}/share`)
          .then(({ data: shares }) =>
            $q
              .all(
                shares.map(({ id: shareId }) =>
                  $http
                    .get(
                      `/storage/netapp/${serviceName}/share/${shareId}/snapshot?detail=true`,
                    )
                    .then(
                      ({ data: snapshots }) =>
                        snapshots.filter(
                          (snapshot) => snapshot.type === SNAPSHOT_TYPE.MANUAL,
                        ).length,
                    ),
                ),
              )
              .then((snapshots) => snapshots.reduce((a, b) => a + b, 0)),
          ),
      snapshotPolicies: /* @ngInject */ (getSnapshotPolicies) =>
        getSnapshotPolicies().catch(() => []),
      currentPolicy: /* @ngInject */ ($http, serviceName, volumeId) =>
        $http
          .get(
            `/storage/netapp/${serviceName}/share/${volumeId}/snapshotPolicy`,
          )
          .then(({ data }) => data)
          .catch(() => ({})),

      /* @ngInject */
      applyPolicy: ($http, serviceName, volumeId) => (snapshotPolicyID) =>
        $http.put(
          `/storage/netapp/${serviceName}/share/${volumeId}/snapshotPolicy`,
          {
            snapshotPolicyID,
          },
        ),
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: `${SNAPSHOT_TRACKING_PREFIX}netapp::volumes::listing::snapshots`,
        ...SNAPSHOT_LISTING_TRACKING_CONTEXT,
      });
    },
  });
};
