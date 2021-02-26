import get from 'lodash/get';
import { MESSAGES_CONTAINER_NAME } from './edit.constant';
import { PCI_HDS_ADDON } from '../project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.edit', {
    url: '/edit?cartId',
    views: {
      contentTab: 'pciProjectEdit',
    },
    params: {
      cartId: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_parameters'),

      cart: /* @ngInject */ (
        $transition$,
        prepareCart,
        OrderCartService,
        hds,
      ) => {
        if (hds.option && !hds.isCertifiedProject && hds.isValidSupportLevel) {
          return $transition$.params().cartId
            ? OrderCartService.getCart($transition$.params().cartId).catch(() =>
                prepareCart(),
              )
            : prepareCart();
        }

        return null;
      },

      checkCartId: ($location, $transition$, cart) => () => {
        const cartId = get(cart, 'cartId');
        const paramsCartId = $transition$.params().cartId;
        if (cartId && paramsCartId !== cartId) {
          $location.search('cartId', cartId);
        }
      },

      hds: /* @ngInject */ (
        hdsProjectOption,
        isCertifiedHdsProject,
        isHdsAvailable,
        isValidForHdsCertification,
        isValidHdsSupportLevel,
      ) => {
        return {
          isAvailable: isHdsAvailable,
          isCertifiedProject: isCertifiedHdsProject,
          isValidForCertification: isValidForHdsCertification,
          isValidSupportLevel: isValidHdsSupportLevel,
          option: hdsProjectOption,
        };
      },

      hdsProjectOption: /* @ngInject */ ($http, projectId) =>
        $http
          .get(`/order/cartServiceOption/cloud/${projectId}`)
          .then(({ data: options }) =>
            options.find(({ planCode }) =>
              planCode.match(`^${PCI_HDS_ADDON.planCodeScope}`),
            ),
          ),

      isCertifiedHdsProject: /* @ngInject */ (
        $http,
        isValidForHdsCertification,
        projectId,
        OvhApiCloudProject,
      ) => {
        if (isValidForHdsCertification) {
          return OvhApiCloudProject.ServiceInfos()
            .v6()
            .get({
              serviceName: projectId,
            })
            .$promise.then((info) =>
              $http
                .get(`/services/${info.serviceId}/options`)
                .then(
                  ({ data: options }) =>
                    options.find(
                      ({ billing, resource }) =>
                        billing?.plan?.code.match(
                          `^${PCI_HDS_ADDON.planCodeScope}`,
                        ) &&
                        resource?.product?.name ===
                          PCI_HDS_ADDON.certifiedProject,
                    ) !== undefined,
                ),
            );
        }
        return false;
      },

      isValidForHdsCertification: /* @ngInject */ (hdsProjectOption) =>
        hdsProjectOption !== undefined,

      onUpdate: /* @ngInject */ (
        $state,
        $timeout,
        $translate,
        CucCloudMessage,
      ) => () =>
        $state
          .reload()
          // We need a digest so message can be displayed
          .then(() =>
            $timeout(() =>
              CucCloudMessage.success(
                $translate.instant('pci_projects_project_edit_update_success'),
                MESSAGES_CONTAINER_NAME,
              ),
            ),
          ),

      prepareCart: /* @ngInject */ (
        coreConfig,
        project,
        OrderCartService,
        hds,
      ) => () => {
        const { ovhSubsidiary } = coreConfig.getUser();
        return OrderCartService.createNewCart(
          ovhSubsidiary,
          hds.option.planCode,
        )
          .then((cart) =>
            OrderCartService.assignCart(cart.cartId).then(() => cart),
          )
          .then((cart) => {
            const priceMode = hds.option.prices.find(({ capacities }) =>
              capacities.includes('renew'),
            );

            return OrderCartService.addOptionToCart(project.project_id, {
              cartId: cart.cartId,
              duration: priceMode.duration,
              planCode: hds.option.planCode,
              pricingMode: priceMode.pricingMode,
              quantity: 1,
            }).then(() => cart);
          });
      },

      setDefault: /* @ngInject */ (PciProjectsService) => (projectId) =>
        PciProjectsService.setAsDefaultProject(projectId),

      summary: /* @ngInject */ (cart, OrderCartService) =>
        cart ? OrderCartService.getSummary(cart.cartId) : null,

      unFavProject: /* @ngInject */ (PciProjectsService) => () =>
        PciProjectsService.removeDefaultProject(),
    },
  });
};
