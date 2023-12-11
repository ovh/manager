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

      activateProject: /* @ngInject */ (
        serviceId,
        projectId,
        projectService,
        claimDiscoveryVoucher,
        goToProjectDashboard,
        discoveryPromotionVoucherAmount,
        displayErrorMessage,
      ) => () => {
        const voucherPayload = {
          code: DISCOVERY_PROMOTION_VOUCHER,
        };

        return claimDiscoveryVoucher(voucherPayload)
          .then(() => projectService.activateDiscoveryProject(serviceId))
          .then(() => goToProjectDashboard(discoveryPromotionVoucherAmount))
          .catch((err) => {
            return displayErrorMessage(err.data.message);
          });
      },

      claimDiscoveryVoucher: /* @ngInject */ (projectService, projectId) => (
        data,
      ) => {
        return projectService.claimVoucher(projectId, data);
      },

      displayErrorMessage: /* @ngInject */ (CucCloudMessage, $translate) => (
        message,
      ) => {
        return CucCloudMessage.error(
          {
            textHtml: $translate.instant(
              'pci_projects_project_activate_message_fail',
              {
                message,
              },
            ),
          },
          'pci.projects.project.activate',
        );
      },

      goToProjectDashboard: /* @ngInject */ (
        $state,
        projectId,
        CucCloudMessage,
        $translate,
      ) => (discoveryPromotionVoucherAmount) => {
        const state = 'pci.projects.project';
        const promise = $state.go(
          state,
          {
            projectId,
          },
          {
            reload: true,
          },
        );

        promise.then(() =>
          discoveryPromotionVoucherAmount
            ? CucCloudMessage.success(
                {
                  textHtml: $translate.instant(
                    'pci_projects_project_activate_message_with_promotion_success',
                    { amount: discoveryPromotionVoucherAmount },
                  ),
                },

                state,
              )
            : CucCloudMessage.success(
                {
                  textHtml: $translate.instant(
                    'pci_projects_project_activate_message_without_promotion_success',
                    { amount: discoveryPromotionVoucherAmount },
                  ),
                },
                state,
              ),
        );

        return promise;
      },
    },
  });
};
