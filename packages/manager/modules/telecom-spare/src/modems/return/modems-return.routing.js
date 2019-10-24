export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare.modems.return', {
      url: '/return?spare',
      views: {
        modal: {
          component: 'returnModemsSpare',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        spare: /* @ngInject */ $transition$ => $transition$.params().spare,
        goBack: /* @ngInject */ goToModems => goToModems,
      },
    });
};
