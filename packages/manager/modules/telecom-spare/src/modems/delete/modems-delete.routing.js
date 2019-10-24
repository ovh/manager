export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare.modems.delete', {
      url: '/delete?spare',
      views: {
        modal: {
          component: 'deleteModemsSpare',
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
