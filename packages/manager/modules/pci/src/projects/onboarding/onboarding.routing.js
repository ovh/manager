import moment from 'moment';

import { PCI_PROJECT_DISCOVERY_ORDER_CART } from '../new/constants';
import { PCI_HDS_ADDON } from '../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectsOnboarding',
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
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
      goToCreateDiscoveryProject: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.discovery'),

      isUsRegion: /* @ngInject */ (coreConfig) =>
        coreConfig.getRegion() === 'US',

      model: /* @ngInject */ (pciProjectNew, me, isUsRegion) =>
        !isUsRegion
          ? pciProjectNew.createOrderCart(me.ovhSubsidiary).then((cart) => {
              const currentDate = moment().format('YYYY-MM-DD');
              return {
                agreements: false,
                description: `Project ${currentDate}`,
                cart,
                hds: cart?.hdsItem !== undefined,
              };
            })
          : null,

      cart: /* @ngInject */ (me, pciProjectNew, isUsRegion) =>
        !isUsRegion
          ? pciProjectNew
              .createOrderCart(me.ovhSubsidiary)
              .then((newOrderCart) =>
                pciProjectNew.getOrderCart(
                  me.ovhSubsidiary,
                  newOrderCart.cartId,
                  true,
                ),
              )
          : null,

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

      summary: /* @ngInject */ (getSummary, isUsRegion) =>
        !isUsRegion ? getSummary() : null,

      getSummary: /* @ngInject */ (cart, orderCart, setCartProjectItem) => () =>
        setCartProjectItem().then(() => orderCart.getSummary(cart?.cartId)),

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

      hdsAddonOption: /* @ngInject */ (orderCart, model, isUsRegion) =>
        !isUsRegion
          ? orderCart.getHdsAddon(
              model?.cart?.cartId,
              PCI_PROJECT_DISCOVERY_ORDER_CART.productName,
              PCI_PROJECT_DISCOVERY_ORDER_CART.planCode,
              PCI_HDS_ADDON.planCode,
            )
          : null,
    },
  });
};
