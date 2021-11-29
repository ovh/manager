import get from 'lodash/get';

import { GUIDE_URLS } from './creating.constants';
import { PCI_FEATURES } from '../../projects.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.creating', {
    url: '/creating',
    views: {
      '@pci': {
        componentProvider: /* @ngInject */ (projectOrder) =>
          projectOrder ? 'pciProjectCreatingNotPaid' : 'pciProjectCreating',
      },
    },
    onEnter: /* @ngInject */ (pciFeatureRedirect) => {
      return pciFeatureRedirect(PCI_FEATURES.OTHERS.CREATE_PROJECT);
    },
    resolve: {
      breadcrumb: () => null,
      guideUrl: /* @ngInject */ (me) => get(GUIDE_URLS, me.ovhSubsidiary),
      onProjectCreated: /* @ngInject */ ($state, $window, projectId) => () => {
        $window.location.replace(
          $state.href('pci.projects.project', {
            projectId,
          }),
        );
        $window.location.reload();
      },
      projectOrder: /* @ngInject */ (
        $state,
        atInternet,
        project,
        projectCreating,
        projectOrderStatus,
      ) => {
        const page = `public-cloud::${$state.current.name.replace(
          /\./g,
          '::',
        )}`;
        if (project.orderId && projectOrderStatus === 'notPaid') {
          atInternet.trackEvent({
            page,
            event: 'PCI_PROJECTS_CREATING_NOT_PAID',
          });

          return projectCreating.getOrderDetails(project.orderId);
        }

        atInternet.trackEvent({
          page,
          event: 'PCI_PROJECTS_CREATING',
        });

        return null;
      },
      projectOrderStatus: /* @ngInject */ (project, projectCreating) => {
        if (project.orderId) {
          return projectCreating
            .getOrderStatus(project.orderId)
            .then(({ status }) => status);
        }
        return null;
      },
    },
  });
};
