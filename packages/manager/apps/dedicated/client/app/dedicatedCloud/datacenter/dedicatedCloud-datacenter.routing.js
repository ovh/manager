import {
  NSX_EDGE_FEATURE,
  NSX_COMPATIBLE_COMMERCIAL_RANGE,
  MIN_NSX_EDGES,
  MAX_NSX_EDGES,
} from './dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.details', {
    url: '/:datacenterId',
    views: {
      'dedicatedCloudView@app.dedicatedCloud.details':
        'ovhManagerDedicatedCloudDatacenter',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) =>
          hasVCDMigration
            ? 'app.dedicatedCloud.details.dashboard-light'
            : 'app.dedicatedCloud.details.datacenter.details.dashboard',
        );
    },
    resolve: {
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      datacenter: /* @ngInject */ (datacenterId, DedicatedCloud, serviceName) =>
        DedicatedCloud.getDatacenterInformations(
          serviceName,
          datacenterId,
        ).then((datacenter) => ({
          model: {
            ...datacenter,
            id: datacenterId,
          },
        })),
      commercialRangeName: /* @ngInject */ (
        DedicatedCloud,
        datacenterId,
        productId,
      ) =>
        DedicatedCloud.getDatacenterInfoProxy(productId, datacenterId).then(
          ({ commercialRangeName }) => commercialRangeName,
        ),
      isNsxEdgeAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(NSX_EDGE_FEATURE)
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(NSX_EDGE_FEATURE),
          ),
      isNsxtCompatible: /* @ngInject */ (commercialRangeName) =>
        NSX_COMPATIBLE_COMMERCIAL_RANGE.some(
          (range) =>
            range === commercialRangeName ||
            range.toLocaleLowerCase() === commercialRangeName,
        ),
      deleteDatacenter: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.dedicatedCloud.details.datacenter.details.dashboard.delete',
        ),
      backupState: () => 'app.dedicatedCloud.details.datacenter.details.backup',
      dashboardState: () =>
        'app.dedicatedCloud.details.datacenter.details.dashboard',
      datastoresState: () =>
        'app.dedicatedCloud.details.datacenter.details.datastores',
      drpState: () => 'app.dedicatedCloud.details.datacenter.details.drp',
      hostsState: () => 'app.dedicatedCloud.details.datacenter.details.hosts',
      networkState: () =>
        'app.dedicatedCloud.details.datacenter.details.network',
      addNsxState: () =>
        'app.dedicatedCloud.details.datacenter.details.dashboard.add-nsx',
      goToHosts: /* @ngInject */ ($state, hostsState) => () =>
        $state.go(hostsState),
      goToDatastores: /* @ngInject */ ($state, datastoresState) => () =>
        $state.go(datastoresState),
      goToBackup: /* @ngInject */ ($state, backupState) => () =>
        $state.go(backupState),
      goToDrp: /* @ngInject */ ($state, drpState) => () => $state.go(drpState),
      goToNetwork: /* @ngInject */ ($state, networkState) => () =>
        $state.go(networkState),
      goToAddNsx: /* @ngInject */ ($state, addNsxState) => () =>
        $state.go(addNsxState),
      virtualMachinesState: () =>
        'app.dedicatedCloud.details.datacenter.details.virtualMachines',
      goToVirtualMachines: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.dedicatedCloud.details.datacenter.details.virtualMachines',
        ),
      goToDrpSummary: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.drp.summary', {
          drpInformations: currentDrp,
        }),
      goToDeleteDrp: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.dedicatedCloud.details.datacenter.details.dashboard.deleteDrp',
        ),
      totalCountNsx: /* @ngInject */ (
        ovhManagerPccDatacenterService,
        serviceName,
        datacenterId,
      ) =>
        ovhManagerPccDatacenterService
          .getNsxtEdgeByDatacenter(serviceName, datacenterId, {
            pageSize: 1,
          })
          .then(({ meta }) => {
            return meta.totalCount;
          })
          .catch(() => {
            return 0;
          }),
      hasMaximumNsx: /* @ngInject */ (totalCountNsx) =>
        totalCountNsx >= MAX_NSX_EDGES,
      hasOnlyMinimumNsx: /* @ngInject */ (totalCountNsx) =>
        totalCountNsx <= MIN_NSX_EDGES,
      setMessage: /* @ngInject */ (Alerter) => (
        message = false,
        type = 'success',
      ) => {
        Alerter.set(
          `alert-${type}`,
          message,
          null,
          'dedicatedCloudDatacenterAlert',
        );
      },
      breadcrumb: /* @ngInject */ (datacenter) => datacenter.model.name,
    },
  });
};
