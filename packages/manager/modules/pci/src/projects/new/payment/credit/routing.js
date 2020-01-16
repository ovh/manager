import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment.credit', {
    url: '/credit',
    views: {
      '': component.name,
    },
    resolve: {
      checkout: (cart, pciProjectNew) => pciProjectNew.checkoutCart(cart),
    },
  });
};
