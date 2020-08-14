export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.move', {
    url: '/move',
    component: 'packMove',
    translations: { value: ['.', './contract'], format: 'json' },
    resolve: {
      goBack: /* @ngInject */ ($state) => (packName) => {
        $state.go(
          packName === 'sdsl' ? 'telecom.dashboard' : 'telecom.packs.pack',
        );
      },
    },
  });
};
