export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipLine-activation', {
    url: '/telephony/activation',
    views: {
      'packView@telecom.packs': 'packVoipLineActivation',
    },
    resolve: {
      packName: /* @ngInject */ ($transition$) =>
        $transition$.params().packName,
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
