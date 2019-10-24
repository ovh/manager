export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare.phones.replace', {
      url: '/replace?spare',
      views: {
        modal: {
          component: 'replacePhonesSpare',
        },
      },
      layout: 'modal',
      translations: {
        value: ['.'],
        format: 'json',
      },
      resolve: {
        spare: /* @ngInject */ $transition$ => $transition$.params().spare,
        goBack: /* @ngInject */ goToPhones => goToPhones,
      },
    });
};
