export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.multisite.cdnConfiguration', {
    url: '/cdnConfiguration',
    layout: 'modal',
    params: {
      domain: null,
    },
    views: {
      modal: {
        component: 'hostingMultisiteCdnConfiguration',
      },
    },
    resolve: {
      goToEditCdn: /* @ngInject */ ($state, $transition$, trackClick) => () => {
        trackClick('web::hosting::multisites::modify-cdn');
        return $state.go('app.hosting.dashboard.cdn.shared', {
          domain: $transition$.params().domain,
          domainName: $transition$.params().domain.name,
        });
      },
      goToFlushCdn: /* @ngInject */ (
        $state,
        $transition$,
        trackClick,
      ) => () => {
        trackClick('web::hosting::multisites::purge-cdn');
        return $state.go('app.hosting.dashboard.cdn.flush', {
          domain: $transition$.params().domain.name,
        });
      },
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      trackClick: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackClick({
          name: hit,
          type: 'action',
        }),
    },
  });
};
