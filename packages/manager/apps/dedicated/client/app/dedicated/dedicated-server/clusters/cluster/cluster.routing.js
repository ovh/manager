import { STATUS, GUIDES_LINK } from './cluster.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster', {
    url: '/cluster/:clusterId',
    views: {
      'rootView@app.dedicated-cluster': {
        component: 'clusterMainPage',
      },
    },
    reloadOnSearch: false,
    redirectTo: 'app.dedicated-cluster.cluster.dashboard',
    resolve: {
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
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      guidesLink: () => GUIDES_LINK,
      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href(
          'app.dedicated-cluster.cluster.dashboard',
          $transition$.params(),
        ),
      nodesLink: /* @ngInject */ ($transition$, $state) =>
        $state.href(
          'app.dedicated-cluster.cluster.allnode',
          $transition$.params(),
        ),
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
