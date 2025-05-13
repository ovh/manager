import component from './component';
import { PCI_PROJECT_ORDER_CART, PCI_PROJECT_STEPS } from '../constants';
import { PCI_HDS_ADDON } from '../../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.config', {
    url: '/config',
    views: {
      '': component.name,

      'banner@pci.projects.new.config': {
        componentProvider: /* @ngInject */ (ovhPciFeatureFlipping) =>
          ovhPciFeatureFlipping.isFeatureActive('pci.onboarding.new.banner')
            ? 'pciProjectNewConfigBanner'
            : null,
      },

      'progress@pci.projects.new.config': 'pciProjectNewProgress',

      'voucher@pci.projects.new.config': 'pciProjectNewVoucher',
    },
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (
      atInternet,
      activeStep,
      step,
      numProjects,
      model,
    ) => {
      activeStep(step.name);
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::new::config',
        pciCreationNumProjects: numProjects,
      });
      if (model.voucher.valid) {
        atInternet.trackPage({
          name: `PublicCloud_new_project_free_voucher::${model.voucher.value}::config`,
        });
      }
    },
    resolve: {
      getActionHref: /* @ngInject */ ($state) => (action) => {
        const actionState =
          action === 'cancel' ? 'pci.projects' : 'pci.projects.new.payment';

        return $state.href(actionState);
      },

      goToPayment: /* @ngInject */ ($state, cart) => () =>
        $state.go('pci.projects.new.payment', {
          cartId: cart.cartId,
        }),

      projectsLink: /* @ngInject */ ($state) => () =>
        $state.href('pci.projects'),

      isItSubsidiary: /* @ngInject */ (coreConfig) =>
        coreConfig.getUser().ovhSubsidiary === 'IT',

      hds: /* @ngInject */ (
        hdsAddonOption,
        isHdsAvailable,
        isValidHdsSupportLevel,
      ) => {
        return {
          isAvailable: isHdsAvailable,
          isCertifiedProject: false,
          isValidForCertification: true,
          isValidSupportLevel: isValidHdsSupportLevel,
          isInprogressRequest: false,
          option: hdsAddonOption,
        };
      },

      hdsAddonOption: /* @ngInject */ (orderCart, cart) =>
        orderCart.getHdsAddon(
          cart.cartId,
          PCI_PROJECT_ORDER_CART.productName,
          PCI_PROJECT_ORDER_CART.planCode,
          PCI_HDS_ADDON.planCode,
        ),

      step: /* @ngInject */ (getStep) =>
        getStep(PCI_PROJECT_STEPS.CONFIGURATION),

      setCartProjectItem: /* @ngInject */ (
        $q,
        model,
        cart,
        pciProjectNew,
      ) => () => {
        if (model.description && !cart.projectItem.descriptionConfiguration) {
          return pciProjectNew.setCartProjectItemDescription(
            cart,
            model.description,
          );
        }

        return $q.when();
      },

      onProgressStepClick: /* @ngInject */ (
        hds,
        model,
        setCartProjectItem,
        goToPayment,
      ) => ({ name, active }) => {
        if (name === PCI_PROJECT_STEPS.PAYMENT && !active) {
          if (model.agreements || hds.isInprogressRequest) {
            return setCartProjectItem().then(() => goToPayment());
          }
        }

        return null;
      },

      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
