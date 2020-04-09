export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall.rule', {
    url: '/rule',
    abstract: true,
    resolve: {
      goBack: /* @ngInject */ (goToFirewall) => goToFirewall,
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      ipBlock: /* @ngInject */ ($transition$) => $transition$.params().ipBlock,
    },
  });
};
