import get from 'lodash/get';

import { GUIDE_URLS } from './creating.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.creating', {
      url: '/creating',
      views: {
        '@pci': {
          componentProvider: /* @ngInject */ projectOrder => (projectOrder ? 'pciProjectCreatingNotPaid' : 'pciProjectCreating'),
        },
      },
      resolve: {
        breadcrumb: () => null,
        guideUrl: /* @ngInject */ me => get(
          GUIDE_URLS,
          me.ovhSubsidiary,
        ),
        onProjectCreated: /* @ngInject */ ($state, $window, projectId) => () => {
          $window.location.replace($state.href('pci.projects.project', {
            projectId,
          }));
          $window.location.reload();
        },
        projectOrder: /* @ngInject */ (project, projectCreating, projectOrderStatus) => {
          if (project.orderId && projectOrderStatus === 'notPaid') {
            return projectCreating
              .getOrderDetails(project.orderId);
          }
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
