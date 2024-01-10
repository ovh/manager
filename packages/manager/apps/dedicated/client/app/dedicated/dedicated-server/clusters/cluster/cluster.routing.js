import { STATUS } from './cluster.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster', {
    url: '/cluster/:clusterId',
    component: 'clusterMainPage',
    reloadOnSearch: false,
    redirectTo: 'app.dedicated-cluster.cluster.dashboard',
    resolve: {
      statePrefix: /* @ngInject */ () => 'app.dedicated-cluster.cluster',
      clusterName: /* @ngInject */ ($transition$) =>
        $transition$.params().clusterId,
      cluster: /* @ngInject */ (Cluster, clusterName) =>
        Cluster.getSelected(clusterName),
      serviceInfos: /* @ngInject */ (Cluster, clusterName) =>
        Cluster.getServiceInfos(clusterName),
      commercialName: /* @ngInject */ (Cluster, serviceInfos) =>
        Cluster.getCommercialName(serviceInfos),
      displayName: /* @ngInject */ (cluster) => cluster.iam.displayName,
      user: /* @ngInject */ (currentUser) => currentUser,
      breadcrumb: /* @ngInject */ (cluster) => cluster.iam.displayName,
      trackingPrefix: () => 'dedicated::dedicated::cluster',
      goToClusterGeneralInfo: /* @ngInject */ (
        $state,
        Alerter,
        displayName,
      ) => (message = false, type = STATUS.DONE, stateReload = false) => {
        const reload = (message && type === STATUS.DONE) || stateReload;
        const promise = $state.go(
          'app.dedicated-cluster.cluster.dashboard',
          {
            displayName,
          },
          {
            reload,
          },
        );
        promise.then(() => {
          if (message) {
            Alerter.alertFromSWS(message, type, 'cluster_dashboard_alert');
          }
        });
        return promise;
      },
    },
  });
};
