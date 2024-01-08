import { DISCOVERY_PROMOTION_VOUCHER } from '../project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.activate', {
    url: '/activate',
    component: 'pciProjectActivate',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_activate_title'),

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId || null,

      activationVoucherCode: /* @ngInject */ () => DISCOVERY_PROMOTION_VOUCHER,

      voucherAmount: /* @ngInject */ (discoveryPromotionVoucherAmount) =>
        discoveryPromotionVoucherAmount,

      activateProject: /* @ngInject */ (
        serviceId,
        projectService,
        claimDiscoveryVoucher,
        activationVoucherCode,
        voucherAmount,
        goToLoadingUpgradePage,
        displayErrorMessage,
      ) => () => {
        const voucherPayload = {
          code: activationVoucherCode,
        };

        if (voucherAmount) {
          return claimDiscoveryVoucher(voucherPayload)
            .then(() => projectService.activateDiscoveryProject(serviceId))
            .then((res) =>
              goToLoadingUpgradePage(
                res.data.order.orderId,
                activationVoucherCode,
              ),
            )
            .catch((err) => displayErrorMessage(err?.data?.message || err));
        }
        return projectService
          .activateDiscoveryProject(serviceId)
          .then((res) => {
            return goToLoadingUpgradePage(
              res?.data?.order?.orderId,
              activationVoucherCode,
            );
          })
          .catch((err) => displayErrorMessage(err?.data?.message || err));
      },

      goToLoadingUpgradePage: /* @ngInject */ ($state) => (
        orderId,
        voucherCode,
      ) => {
        return $state.go('pci.projects.updating', {
          orderId,
          voucherCode,
        });
      },

      claimDiscoveryVoucher: /* @ngInject */ (projectService, projectId) => (
        data,
      ) => projectService.claimVoucher(projectId, data),

      displayErrorMessage: /* @ngInject */ (CucCloudMessage, $translate) => (
        message,
      ) =>
        CucCloudMessage.error(
          {
            textHtml: $translate.instant(
              'pci_projects_project_activate_message_fail',
              {
                message,
              },
            ),
          },
          'pci.projects.project.activate',
        ),
    },
  });
};
