export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter', {
    url: '/datacenter/:datacenterId',
    views: {
      dedicatedCloudView: 'ovhManagerDedicatedCloudDatacenter',
    },
    redirectTo: 'app.managedBaremetal.datacenter.dashboard',
    resolve: {
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      datacenter: /* @ngInject */ (datacenterId, DedicatedCloud, serviceName) =>
        DedicatedCloud.getDatacenterInformations(
          serviceName,
          datacenterId,
          true,
        ).then((datacenter) => ({
          model: {
            ...datacenter,
            id: datacenterId,
          },
        })),
      deleteDatacenter: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.dashboard.delete'),
      backupState: () => 'app.managedBaremetal.datacenter.backup',
      dashboardState: () => 'app.managedBaremetal.datacenter.dashboard',
      datastoresState: () => 'app.managedBaremetal.datacenter.datastores',
      drpState: () => 'app.managedBaremetal.datacenter.drp',
      hostsState: () => 'app.managedBaremetal.datacenter.hosts',
      goToHosts: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.hosts'),
      goToDatastores: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.datastores'),
      goToBackup: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.backup'),
      goToDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.drp'),
      goToDrpSummary: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.managedBaremetal.datacenter.drp.summary', {
          drpInformations: currentDrp,
        }),
      goToDeleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenter.dashboard.deleteDrp'),
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
    },
  });
};
