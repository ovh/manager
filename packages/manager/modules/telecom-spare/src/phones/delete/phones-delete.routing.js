export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('spare.phones.delete', {
      url: '/delete?spare',
      views: {
        modal: {
          component: 'deletePhonesSpare',
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
