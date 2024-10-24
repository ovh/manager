export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.datacenters.datacenter', {
    url: '/:datacenterId',
    views: {
      'dedicatedCloudView@app.managedBaremetal.details':
        'ovhManagerDedicatedCloudDatacenter',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('hasVCDMigration')
        .then((hasVCDMigration) =>
          hasVCDMigration
            ? 'app.managedBaremetal.details.dashboard-light'
            : 'app.managedBaremetal.details.datacenters.datacenter.dashboard',
        );
    },
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
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.dashboard.delete',
        ),
      backupState: () =>
        'app.managedBaremetal.details.datacenters.datacenter.backup',
      dashboardState: () =>
        'app.managedBaremetal.details.datacenters.datacenter.dashboard',
      datastoresState: () =>
        'app.managedBaremetal.details.datacenters.datacenter.datastores',
      drpState: () => 'app.managedBaremetal.details.datacenters.datacenter.drp',
      hostsState: () =>
        'app.managedBaremetal.details.datacenters.datacenter.hosts',
      goToHosts: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.hosts'),
      goToDatastores: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.datastores',
        ),
      goToBackup: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.backup'),
      goToDrp: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.details.datacenters.datacenter.drp'),
      goToDrpSummary: /* @ngInject */ ($state, currentDrp) => () =>
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.drp.summary',
          {
            drpInformations: currentDrp,
          },
        ),
      goToDeleteDrp: /* @ngInject */ ($state) => () =>
        $state.go(
          'app.managedBaremetal.details.datacenters.datacenter.dashboard.deleteDrp',
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
      breadcrumb: /* @ngInject */ (datacenterId) => datacenterId,
      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (click) => {
        atInternet.trackClick({
          name: `${trackingPrefix}::details::${click}`,
          type: 'action',
        });
      },
    },
  });
};
