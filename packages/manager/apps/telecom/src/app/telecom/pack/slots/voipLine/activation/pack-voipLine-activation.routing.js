export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipLine-activation', {
    url: '/telephony/activation',
    component: 'packVoipLineActivation',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
