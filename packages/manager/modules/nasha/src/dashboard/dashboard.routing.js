import { SIZE_MIN } from '../components/partition/partition.constants';
import { SERVICE_TYPE } from './dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  const dashboardStateName = 'nasha.dashboard';
  const editNameStateName = `${dashboardStateName}.edit-name`;

  $stateProvider.state(dashboardStateName, {
    url: '/:serviceName',
    component: 'nashaDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      currentHref: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(dashboardStateName, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(editNameStateName, { serviceName }),
      goBack: /* @ngInject */ (
        $state,
        serviceName,
        alertSuccess,
        alertError,
      ) => ({ success, error, stateName, reload } = {}) => {
        const name = stateName || '^';
        const prms = { serviceName };
        const opts = {
          reload: reload === true || (Boolean(success) && reload !== false),
        };
        return $state.go(name, prms, opts).then((result) => {
          if (success) {
            alertSuccess(success);
          }
          if (error) {
            alertError(error);
          }
          return result;
        });
      },
      goToEditName: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(editNameStateName, { serviceName }),
      goToPartitionsCreate: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(`${dashboardStateName}.partitions.create`, { serviceName }),
      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
      nasha: /* @ngInject */ (
        OvhApiDedicatedNasha,
        serviceName,
        prepareNasha,
      ) => {
        const aapi = OvhApiDedicatedNasha.Aapi();
        aapi.resetCache();
        return aapi.get({ serviceName }).$promise.then(prepareNasha);
      },
      nashaApiUrl: /* @ngInject */ (baseApiUrl, serviceName) =>
        `${baseApiUrl}/${serviceName}`,
      partitionAllocatedSize: /* @ngInject */ (iceberg, nashaApiUrl) =>
        iceberg(`${nashaApiUrl}/partition`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) =>
            data.reduce(
              (totalSize, partition) => totalSize + partition.size,
              0,
            ),
          ),
      canCreatePartitions: /* @ngInject */ (partitionAllocatedSize, nasha) =>
        partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN,
      reload: /* @ngInject */ ($state, goBack) => ({ success, error } = {}) =>
        goBack({
          stateName: $state.current.name,
          reload: true,
          success,
          error,
        }),
      serviceInfo: /* @ngInject */ ($http, nashaApiUrl) =>
        $http
          .get(`${nashaApiUrl}/serviceInfos`)
          .then(({ data }) => ({ ...data, serviceType: SERVICE_TYPE })),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      taskApiUrl: /* @ngInject */ (nashaApiUrl) => `${nashaApiUrl}/task`,
    },
    atInternet: {
      rename: 'nasha::dashboard',
    },
  });
};
