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
        partitions,
      ) => {
        /* The back-end returns a wrong value: 0. So we have to cumulate the partitions' usedbysnapshots &
          to cumulate usedbysnapshots + used.value
        */
        const totalUsedBySnapshots = partitions.error
          ? 0
          : partitions.reduce(
              (
                sum,
                {
                  use: {
                    usedbysnapshots: { value },
                  },
                },
              ) => sum + value,
              0,
            );

        const aapi = OvhApiDedicatedNasha.Aapi();
        aapi.resetCache();
        return aapi.get({ serviceName }).$promise.then((resp) =>
          prepareNasha({
            ...resp,
            totalUsedBySnapshots: Number(totalUsedBySnapshots.toFixed(2)),
          }),
        );
      },
      nashaApiUrl: /* @ngInject */ (baseApiUrl, serviceName) =>
        `${baseApiUrl}/${serviceName}`,
      partitionAllocatedSize: /* @ngInject */ (partitions) =>
        partitions?.error
          ? 0
          : partitions.reduce((totalSize, { size }) => totalSize + size, 0),
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

      isNashaLegacyServicesPeriod: /* @ngInject */ (ovhFeatureFlipping) => {
        const featureId = 'dedicated-nasha:eol-lv1-lv2';
        return ovhFeatureFlipping
          .checkFeatureAvailability(featureId)
          .then((feature) => feature.isFeatureAvailable(featureId));
      },

      isNashaLegacyService: /* @ngInject */ (nasha) => {
        const { datacenter, diskType } = nasha;
        return ['rbx', 'sbg', 'bhs'].includes(datacenter) && diskType === 'hdd';
      },

      isNashaEolServiceBannerAvailable: /* @ngInject */ (
        isNashaLegacyServicesPeriod,
        isNashaLegacyService,
      ) => {
        return isNashaLegacyServicesPeriod && isNashaLegacyService;
      },
      partitions: /* @ngInject */ (
        serviceName,
        preparePartition,
        OvhApiDedicatedNashaAapi,
      ) => {
        OvhApiDedicatedNashaAapi.resetCache();
        return OvhApiDedicatedNashaAapi.partitions({
          serviceName,
        })
          .$promise.then((partitions) => partitions.map(preparePartition))
          .catch((error) => ({ error: { ...error, partitions: [] } }));
      },
    },
    atInternet: {
      rename: 'nasha::dashboard',
    },
  });
};
