import get from 'lodash/get';

import component from './component';

import { GUIDE_URLS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.updating', {
    url: '/updating/:orderId/:voucherCode',
    views: {
      '@pci': component.name,
    },
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (atInternet, numProjects) => {
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::updating',
        pciCreationNumProjects: numProjects,
      });
    },
    resolve: {
      breadcrumb: () => null,

      guideUrl: /* @ngInject */ (me) => get(GUIDE_URLS, me.ovhSubsidiary),

      pciProjectsHref: /* @ngInject */ ($state) => $state.href('pci.projects'),

      onProjectUpdated: /* @ngInject */ (
        atInternet,
        $state,
        voucherCode,
        pciProjectService,
        CucCloudMessage,
        $translate,
      ) => (projectId) => {
        atInternet.trackPage({
          name: 'public-cloud::pci::projects::updated',
          projectId,
          ...(voucherCode ? { voucherCode } : {}),
        });

        const state = 'pci.projects.project';

        const promise = $state.go(
          state,
          {
            projectId,
          },
          { reload: true },
        );

        promise
          .then(() => {
            return pciProjectService
              .getVouchersCreditDetails(projectId)
              .then((vouchersCreditDetails) => {
                // eslint-disable-next-line camelcase
                return vouchersCreditDetails[0]?.available_credit?.text || '';
              });
          })
          .then((voucherCredit) =>
            voucherCredit
              ? CucCloudMessage.success(
                  {
                    textHtml: $translate.instant(
                      'pci_projects_project_activate_message_with_promotion_success',
                      { amount: voucherCredit },
                    ),
                  },

                  state,
                )
              : CucCloudMessage.success(
                  {
                    textHtml: $translate.instant(
                      'pci_projects_project_activate_message_without_promotion_success',
                    ),
                  },
                  state,
                ),
          );

        return promise;
      },

      onProjectUpdateFail: /* @ngInject */ (
        $state,
        $translate,
        trackProjectCreationError,
      ) => () => {
        trackProjectCreationError(
          'updating',
          'pci_projects_updating_delivery_error',
        );
        return $state.go(
          'pci.error',
          {
            message: $translate.instant('pci_projects_updating_delivery_error'),
          },
          {
            location: false,
          },
        );
      },

      orderId: /* @ngInject */ ($transition$) => $transition$.params().orderId,

      order: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderDetails(orderId, { extension: true }),

      orderStatus: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderStatus(orderId),

      voucherCode: /* @ngInject */ ($transition$) =>
        $transition$.params().voucherCode,
    },
  });
};
