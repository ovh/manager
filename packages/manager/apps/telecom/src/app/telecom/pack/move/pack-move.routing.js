export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.move', {
    url: '/move',
    views: {
      'packView@telecom.packs': 'packMove',
    },
    translations: { value: ['.', './contract'], format: 'json' },
    resolve: {
      packName: /* @ngInject */ ($transition$) =>
        $transition$.params().packName,
      goBack: /* @ngInject */ ($state) => (packName) => {
        $state.go(
          packName === 'sdsl' ? 'telecom.dashboard' : 'telecom.packs.pack',
        );
      },
    },
  });
};
