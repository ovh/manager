export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.modem.wifi.config', {
    url: '/config?wifiName&ssid',
    views: {
      modal: {
        component: 'configWifiModal',
      },
    },
    layout: 'modal',
    resolve: {
      wifiName: /* @ngInject */ ($transition$) =>
        $transition$.params().wifiName,
      ssid: /* @ngInject */ ($transition$) => $transition$.params().ssid,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      breadcrumb: () => null,
    },
  });
};
