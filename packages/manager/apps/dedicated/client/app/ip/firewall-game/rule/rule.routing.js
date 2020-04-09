export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.firewall-game.rule', {
    url: '/rule',
    abstract: true,
    resolve: {
      goBack: /* @ngInject */ (goToFirewallGame) => goToFirewallGame,
      ip: /* @ngInject */ ($transition$) => $transition$.params().ip,
      ipBlock: /* @ngInject */ ($transition$) => $transition$.params().ipBlock,
    },
  });
};
