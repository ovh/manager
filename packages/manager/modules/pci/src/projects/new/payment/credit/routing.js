import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.payment.credit', {
    url: '/credit',
    views: {
      '': component.name,
    },
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (atInternet, numProjects) => {
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::new::payment::credit',
        pciCreationNumProjects: numProjects,
      });
    },
    resolve: {
      checkout: (cart, pciProjectNew) => pciProjectNew.checkoutCart(cart),
    },
  });
};
