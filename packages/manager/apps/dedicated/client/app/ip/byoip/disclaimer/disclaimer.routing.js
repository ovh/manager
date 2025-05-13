import disclaimerComponent from './disclaimer.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.byoip.disclaimer', {
    url: '/disclaimer',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('byoip')
        .then((byoip) => (!byoip ? { state: 'app.ip.byoip' } : false)),
    views: {
      modal: {
        component: disclaimerComponent.name,
      },
    },
    params: {
      byoip: null,
    },
    layout: 'modal',
    resolve: {
      byoip: /* @ngInject */ ($transition$) => $transition$.params().byoip,
      goBack: /* @ngInject */ (goToByoipConfiguration) =>
        goToByoipConfiguration,
      goToExpressOrder: /* @ngInject */ ($window, goBack) => (url) => {
        $window.open(url, '_blank');
        return goBack();
      },
      breadcrumb: () => null,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::bring-your-own-ip::confirmation',
    },
  });
};
