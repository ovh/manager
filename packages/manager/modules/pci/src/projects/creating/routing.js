import component from './component';

import { GUIDE_URLS } from './constants';
import { DISCOVERY_PROJECT_PLANCODE } from '../project/project.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.creating', {
    url: '/creating/:orderId/:voucherCode?redirectState',
    views: {
      '@pci': component.name,
    },
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    onEnter: /* @ngInject */ (
      atInternet,
      numProjects,
      isCreatingDiscoveryProject,
    ) => {
      atInternet.setPciProjectMode({
        isDiscoveryProject: isCreatingDiscoveryProject,
        projectId: '',
      });
      atInternet.trackPage({
        name: 'PublicCloud::pci::projects::creating',
        pciCreationNumProjects: numProjects,
      });
    },
    resolve: {
      breadcrumb: () => null,

      guideUrl: /* @ngInject */ (me) =>
        GUIDE_URLS[me.ovhSubsidiary] || GUIDE_URLS.DEFAULT,

      pciProjectsHref: /* @ngInject */ ($state) => $state.href('pci.projects'),

      onProjectDelivered: /* @ngInject */ (
        atInternet,
        voucherCode,
        numProjects,
        isRedirectRequired,
        getTargetedState,
        goToState,
        isCreatingDiscoveryProject,
        redirectState,
      ) => (projectId) => {
        atInternet.setPciProjectMode({
          isDiscoveryProject: isCreatingDiscoveryProject,
          projectId,
        });

        atInternet.trackPage({
          name: 'public-cloud::pci::projects::created',
          projectId,
          ...(voucherCode ? { voucherCode } : {}),
          pciCreationNumProjects3: numProjects,
        });

        let targetedStatePromise;

        if (redirectState) {
          targetedStatePromise = Promise.resolve({ state: redirectState });
        } else if (isRedirectRequired) {
          targetedStatePromise = getTargetedState({ project_id: projectId });
        } else {
          targetedStatePromise = Promise.resolve({
            state: 'pci.projects.project',
            params: { projectId },
          });
        }

        return goToState(targetedStatePromise);
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

      order: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderDetails(orderId, { extension: true }),

      orderStatus: /* @ngInject */ (orderId, pciProjectCreating) =>
        pciProjectCreating.getOrderStatus(orderId),

      voucherCode: /* @ngInject */ ($transition$) =>
        $transition$.params().voucherCode,

      isCreatingDiscoveryProject: /* @ngInject */ (order) =>
        Boolean(
          order.find(
            (item) => item.order?.plan.code === DISCOVERY_PROJECT_PLANCODE,
          ),
        ),

      redirectState: /* @ngInject */ ($transition$) =>
        $transition$.params().redirectState,
    },
  });
};
