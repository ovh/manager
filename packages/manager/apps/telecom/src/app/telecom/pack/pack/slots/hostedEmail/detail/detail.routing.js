export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hostedEmail-detail', {
    url: '/hostedEmail/:serviceName/detail',
    views: {
      'packView@telecom.packs': 'packSlotHostedEmailDetail',
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      packName: /* @ngInject */ ($transition$) =>
        $transition$.params().packName,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
    },
  });
};
