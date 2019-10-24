export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare.modems.replace', {
      url: '/replace?spare',
      views: {
        modal: {
          component: 'replaceModemsSpare',
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
