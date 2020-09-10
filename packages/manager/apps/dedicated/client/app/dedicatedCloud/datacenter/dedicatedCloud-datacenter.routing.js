export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter', {
    url: '/datacenter/:datacenterId',
    views: {
      dedicatedCloudView: 'ovhManagerDedicatedCloudDatacenter',
    },
    redirectTo: 'app.dedicatedClouds.datacenter.dashboard',
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
        $state.go('app.dedicatedClouds.datacenter.dashboard.delete'),
      backupState: () => 'app.dedicatedClouds.datacenter.backup',
      dashboardState: () => 'app.dedicatedClouds.datacenter.dashboard',
      datastoresState: () => 'app.dedicatedClouds.datacenter.datastores',
      drpState: () => 'app.dedicatedClouds.datacenter.drp',
      hostsState: () => 'app.dedicatedClouds.datacenter.hosts',
      goToHosts: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.hosts'),
      goToDatastores: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.datastores'),
      goToBackup: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.backup'),
      goToDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.drp'),
      goToDrpSummary: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.dedicatedClouds.datacenter.drp.summary', {
          drpInformations: currentDrp,
        }),
      goToDeleteDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenter.dashboard.deleteDrp'),
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
