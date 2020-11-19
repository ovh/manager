export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hostedEmail-detail', {
    url: '/hostedEmail/:serviceName/detail',
    component: 'packSlotHostedEmailDetail',
    translations: { value: ['.'], format: 'json' },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      goBack: /* @ngInject */ ($state) => () => $state.go('telecom.packs.pack'),
    },
  });
};
