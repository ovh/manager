import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.new.payment', {
      url: '/payment?type',
      component: 'pciProjectNewPayment',
      resolve: {
        checkDescriptionStep: /* @ngInject */ ($state, newProjectModel) => {
          if (!newProjectModel.agreements) {
            return $state.go('pci.projects.new');
          }

          return true;
        },
        paymentType: /* @ngInject */ $transition$ => get(
          $transition$.params(),
          'type',
          'paymentMethod',
        ),
      },
    });
};
