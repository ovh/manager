import { PCI_PROJECT_ORDER_CART } from '../new/constants';
import { PCI_HDS_ADDON } from '../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('publicCloud')
        .getDefaultProject()
        .then((projectId) =>
          projectId
            ? {
                state: 'pci.projects.project',
                params: {
                  projectId,
                },
              }
            : null,
        ),
    resolve: {
      goToCreateNewProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.new'),

      goToCreateDiscoveryProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.discovery'),

      model: /* @ngInject */ (pciProjectNew, me) =>
        pciProjectNew.createOrderCart(me.ovhSubsidiary).then((cart) => ({
          agreements: false,
          description: 'discoveryProject',
          cart,
          hds: cart?.hdsItem !== undefined,
        })),

      cart: /* @ngInject */ (me, pciProjectNew) =>
        pciProjectNew
          .createOrderCart(me.ovhSubsidiary)
          .then((newOrderCart) =>
            pciProjectNew.getOrderCart(me.ovhSubsidiary, newOrderCart.cartId),
          ),

      setCartProjectItem: /* @ngInject */ (model, cart, pciProjectNew) => () =>
        pciProjectNew.setCartProjectItemDescription(cart, model.description),

      summary: /* @ngInject */ (getSummary) => getSummary(),

      getSummary: /* @ngInject */ (cart, orderCart, setCartProjectItem) => () =>
        setCartProjectItem().then(() => orderCart.getSummary(cart.cartId)),

      hds: /* @ngInject */ (
        hdsAddonOption,
        isHdsAvailable,
        isValidHdsSupportLevel,
      ) => ({
        isAvailable: isHdsAvailable,
        isCertifiedProject: false,
        isValidForCertification: true,
        isValidSupportLevel: isValidHdsSupportLevel,
        isInprogressRequest: false,
        option: hdsAddonOption,
      }),

      hdsAddonOption: /* @ngInject */ (orderCart, model) =>
        orderCart.getHdsAddon(
          model?.cart?.cartId,
          PCI_PROJECT_ORDER_CART.productName,
          PCI_PROJECT_ORDER_CART.planCode,
          PCI_HDS_ADDON.planCode,
        ),
    },
  });
};
