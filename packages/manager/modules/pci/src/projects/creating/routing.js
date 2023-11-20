import get from 'lodash/get';

import component from './component';

import { GUIDE_URLS } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.creating', {
    url: '/creating/:orderId/:voucherCode/:isDiscoveryProject',
    views: {
      '@pci': component.name,
    },
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (atInternet, numProjects) => {
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::creating',
        pciCreationNumProjects: numProjects,
      });
    },
    resolve: {
      breadcrumb: () => null,

      guideUrl: /* @ngInject */ (me) => get(GUIDE_URLS, me.ovhSubsidiary),

      pciProjectsHref: /* @ngInject */ ($state) => $state.href('pci.projects'),

      onProjectDelivered: /* @ngInject */ (
        atInternet,
        voucherCode,
        numProjects,
        isRedirectRequired,
        getTargetedState,
        goToState,
      ) => (projectId) => {
        atInternet.trackPage({
          name: 'public-cloud::pci::projects::created',
          projectId,
          ...(voucherCode ? { voucherCode } : {}),
          pciCreationNumProjects3: numProjects,
        });

        // Used in redirection case to a specific page
        if (isRedirectRequired) {
          const targetState = getTargetedState({ project_id: projectId });

          return goToState(targetState);
        }

        return goToState({
          state: 'pci.projects.project',
          params: { projectId },
        });
      },

      onProjectDeliveryFail: /* @ngInject */ (
        $state,
        $translate,
        trackProjectCreationError,
      ) => () => {
        trackProjectCreationError(
          'creating',
          'pci_projects_creating_delivery_error',
        );
        return $state.go(
          'pci.error',
          {
            message: $translate.instant('pci_projects_creating_delivery_error'),
          },
          {
            location: false,
          },
        );
      },

      orderId: /* @ngInject */ ($transition$) => $transition$.params().orderId,

      orderStatus: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderStatus(orderId),

      voucherCode: /* @ngInject */ ($transition$) =>
        $transition$.params().voucherCode,

      isCreatingDiscoveryProject: /* @ngInject */ ($transition$) =>
        $transition$.params().isDiscoveryProject === 'true',
    },
  });
};
