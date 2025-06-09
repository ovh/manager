import { DISCOVERY_PROMOTION_VOUCHER } from '../project.constants';

import { registerPCINewState } from '../../new/routing';
import { registerPCINewPaymentState } from '../../new/payment/routing';
import { registerPCINewPaymentCreditState } from '../../new/payment/credit/routing';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'pci.projects.project.activate';
  const paymentStateName = `${stateName}.payment`;
  const paymentCreditStateName = `${paymentStateName}.credit`;

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
        $q,
        $state,
        serviceId,
        projectService,
        claimDiscoveryVoucher,
        activationVoucherCode,
        voucherAmount,
        goToLoadingUpgradePage,
        displayErrorMessage,
        globalLoading,
        ovhShell,
      ) => ({ simulate = true, autoPay = true } = {}) => {
        const voucherPayload = {
          code: activationVoucherCode,
        };

        let promise = $q.when();

        if (voucherAmount) {
          promise = promise.then(() => claimDiscoveryVoucher(voucherPayload));
        }

        if (simulate) {
          promise = promise.then(() =>
            projectService
              .simulateActivateDiscoveryProject(serviceId)
              .then(({ data: { order } }) => {
                if (order.prices.withTax.value !== 0) {
                  Object.assign(globalLoading, { finalize: false });
                  $state.go(
                    paymentCreditStateName,
                    { amount: order.prices.withoutTax.text },
                    { location: false },
                  );
                  return false;
                }
                return true;
              })
              .catch((err) => displayErrorMessage(err?.data?.message || err)),
          );
        } else {
          promise = promise.then(() => true);
        }

        return promise.then(
          (activate) =>
            activate &&
            projectService
              .activateDiscoveryProject(serviceId, autoPay)
              .then(({ data: { order } }) => {
                ovhShell.tracking.trackMixCommanderS3({
                  name: 'PCI project creation',
                  tc_additional_params: {
                    pcat: 'publiccloud',
                    ot: 'pci_project_creation',
                    conversion_date: new Date().toISOString(),
                    pci_mode: 'discovery',
                    pci_voucher: activationVoucherCode,
                  },
                });

                if (!autoPay && order.url) {
                  window.top.location.href = order.url;
                  return null;
                }
                return goToLoadingUpgradePage(
                  order.orderId,
                  activationVoucherCode,
                );
              })
              .catch((err) => displayErrorMessage(err?.data?.message || err)),
        );
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

  registerPCINewPaymentCreditState($stateProvider, {
    stateName: paymentCreditStateName,
    views: {
      default: `payment@${stateName}`,
    },
    resolve: {
      breadcrumb: () => null,
      extendViewOptions: /* @ngInject */ (
        viewOptions,
        $translate,
        activateProject,
      ) => {
        Object.assign(viewOptions, {
          creditBtnText: $translate.instant(
            'pci_projects_project_activate_cta',
          ),
          onCreditBtnClick: () =>
            activateProject({ simulate: false, autoPay: false }),
        });
      },
    },
  });
};
