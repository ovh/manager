import disclaimerComponent from './disclaimer.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.byoip.disclaimer', {
    url: '/disclaimer',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('expressOrderUrl')
        .then((expressOrderUrl) =>
          !expressOrderUrl ? { state: 'app.ip.byoip' } : false,
        ),
    views: {
      modal: {
        component: disclaimerComponent.name,
      },
    },
    params: {
      expressOrderUrl: null,
    },
    layout: 'modal',
    resolve: {
      expressOrderUrl: /* @ngInject */ ($transition$) =>
        $transition$.params().expressOrderUrl,
      goBack: /* @ngInject */ (goToByoipConfiguration) =>
        goToByoipConfiguration,
      goToExpressOrder: /* @ngInject */ ($window, expressOrderUrl) => () => {
        return $window.open(expressOrderUrl, '_blank');
      },
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
