export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipLine-activation', {
    url: '/telephony/activation',
    component: 'packVoipLineActivation',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telefony_activation_add_line_title'),
    },
  });
};
