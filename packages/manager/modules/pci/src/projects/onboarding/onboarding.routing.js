import moment from 'moment';

import { PCI_PROJECT_DISCOVERY_ORDER_CART } from '../new/constants';
import { PCI_HDS_ADDON } from '../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectsOnboarding',
    redirectTo: (transition) => {
      const [$q, publicCloud] = ['$q', 'publicCloud'].map((token) =>
        transition.injector().get(token),
      );
      return $q
        .all({
          discoveryProjectId: publicCloud.getDiscoveryProject(),
          defaultProjectId: publicCloud.getDefaultProject(),
          unPaidProjects: publicCloud.getUnpaidProjects(),
        })
        .then(({ discoveryProjectId, defaultProjectId, unPaidProjects }) => {
          const projectId = discoveryProjectId || defaultProjectId;

          if (unPaidProjects.length) {
            return { state: 'pci.projects' };
          }
          if (projectId) {
            return { state: 'pci.projects.project', params: { projectId } };
          }
          return false;
        });
    },
    resolve: {
      goToCreateNewProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.new'),

      goToCreateDiscoveryProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.discovery'),

      model: /* @ngInject */ (pciProjectNew, me) =>
        pciProjectNew.createOrderCart(me.ovhSubsidiary).then((cart) => {
          const currentDate = moment().format('YYYY-MM-DD');
          return {
            agreements: false,
            description: `Project ${currentDate}`,
            cart,
            hds: cart?.hdsItem !== undefined,
          };
        }),

      cart: /* @ngInject */ (me, pciProjectNew) =>
        pciProjectNew
          .createOrderCart(me.ovhSubsidiary)
          .then((newOrderCart) =>
            pciProjectNew.getOrderCart(
              me.ovhSubsidiary,
              newOrderCart.cartId,
              true,
            ),
          ),

      setCartProjectItem: /* @ngInject */ (model, cart, pciProjectNew) => () =>
        pciProjectNew.setCartProjectItemDescription(cart, model.description),

      onCartFinalized: /* @ngInject */ ($state, cart) => (
        { orderId },
        isDiscoveryProject,
      ) => {
        return $state.go('pci.projects.creating', {
          orderId,
          voucherCode: cart?.projectItem?.voucherConfiguration?.value || '',
          isDiscoveryProject,
        });
      },

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
          PCI_PROJECT_DISCOVERY_ORDER_CART.productName,
          PCI_PROJECT_DISCOVERY_ORDER_CART.planCode,
          PCI_HDS_ADDON.planCode,
        ),
    },
  });
};
