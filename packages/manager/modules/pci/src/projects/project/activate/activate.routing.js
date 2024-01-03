import { DISCOVERY_PROMOTION_VOUCHER } from '../project.constants';

import { registerPCINewState } from '../../new/routing';
import { registerPCINewPaymentState } from '../../new/payment/routing';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'pci.projects.project.activate';
  const paymentStateName = `${stateName}.payment`;

  registerPCINewState($stateProvider, {
    redirectIfDiscovery: false,
    configStep: false,
    stateName,
    paymentStateName,
    url: '/activate',
    component: 'pciProjectActivate',
    views: {
      default: '@pci.projects.project',
      new: `payment@${stateName}`,
    },
    viewOptions: {
      standalone: false,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_activate_title'),

      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId || null,

      activateProject: /* @ngInject */ (
        serviceId,
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
          .catch((err) => displayErrorMessage(err?.data?.message || err));
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
  registerPCINewPaymentState($stateProvider, {
    stateName: paymentStateName,
    configStep: false,
    bindings: {
      discoveryPromotionVoucherAmount: '@',
    },
    views: {
      default: `@${paymentStateName}`,
      progress: `progress@${paymentStateName}`,
      payment: `payment@${paymentStateName}`,
      credits: `credits@${paymentStateName}`,
      challenge: `challenge@${paymentStateName}`,
      voucher: `voucher@${paymentStateName}`,
      dlp: `dlp@${paymentStateName}`,
    },
    viewOptions: {
      title: false,
      subtitlesSize: 4,
      foldVoucher: false,
      denseVoucher: true,
      paymentsPerLine: (paymentMethods) => paymentMethods.length,
      registerExplanationTexts: { sepa: { banner: 'warning' } },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
