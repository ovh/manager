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
      sendPageTracking: /* @ngInject */ (atInternet) =>
        atInternet.trackPage({
          name: 'PublicCloud::pci::projects::project::activate-project',
        }),
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
          .then((res) =>
            goToLoadingUpgradePage(
              res?.data?.order?.orderId,
              activationVoucherCode,
            ),
          )
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
      ) =>
        projectService.claimVoucher(projectId, data).catch((err) => {
          if (!/VOUCHER_ALREADY_USED/.exec(err.data?.message)) {
            throw err;
          }
        }),

      displayErrorMessage: /* @ngInject */ (
        CucCloudMessage,
        $translate,
        trackPage,
      ) => (message) => {
        trackPage(
          'PublicCloud::pci::projects::project::activate-project-error',
        );
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
    },
  });

  registerPCINewPaymentState($stateProvider, {
    stateName: paymentStateName,
    configStep: false,
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
      voucherView: true,
      foldVoucher: false,
      denseVoucher: true,
      clearableVoucher: false,
      trackingPrefix: 'PublicCloud_activate_project::',
      paymentsPerLine: (paymentMethods) => paymentMethods.length,
      registerExplanationTexts: { sepa: { banner: 'warning' } },
      stateName: paymentStateName,
    },
    resolve: {
      breadcrumb: () => null,
      extendViewOptions: /* @ngInject */ (
        viewOptions,
        $translate,
        activateProject,
        discoveryPromotionVoucherAmount,
      ) => {
        Object.assign(viewOptions, {
          submitText: $translate.instant('pci_projects_project_activate_cta'),
          onSubmit: activateProject,
          voucherView: Boolean(discoveryPromotionVoucherAmount),
        });
      },
    },
  });
};
