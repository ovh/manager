export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.details', {
    url: '/:datacenterId',
    views: {
      'dedicatedCloudView@app.dedicatedCloud.details':
        'ovhManagerDedicatedCloudDatacenter',
    },
    redirectTo: 'app.dedicatedCloud.details.datacenter.details.dashboard',
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
      goToHosts: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.hosts'),
      goToDatastores: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.datastores'),
      goToBackup: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.backup'),
      goToDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.drp'),
      goToDrpSummary: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.details.drp.summary', {
          drpInformations: currentDrp,
        }),
      goToDeleteDrp: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.dedicatedCloud.details.datacenter.details.dashboard.deleteDrp',
        ),
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
