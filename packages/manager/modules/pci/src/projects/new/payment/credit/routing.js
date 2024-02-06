import component from './component';

import { PCI_NEW_PAYMENT_STATE_NAME } from '../../routing';

export const registerPCINewPaymentCreditState = (
  $stateProvider,
  {
    stateName = `${PCI_NEW_PAYMENT_STATE_NAME}.credit`,
    url = '/credit',
    views = {
      default: '',
    },
    viewOptions = {
      creditBtnText: null,
      onCreditBtnClick: null,
    },
    resolve,
  } = {},
) => {
  $stateProvider.state(stateName, {
    url,
    views: {
      [views.default]: component.name,
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
      checkout: /* @ngInject */ (cart, pciProjectNew) =>
        pciProjectNew.checkoutCart(cart),
      viewOptions: () => viewOptions,
      ...resolve,
    },
  });
};

export default /* @ngInject */ ($stateProvider) => {
  registerPCINewPaymentCreditState($stateProvider);
};
