import get from 'lodash/get';

import { TOKEN_GUIDE } from './openstack-token.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.openstack-token', {
    url: '/token/generate?userId',
    views: {
      modal: {
        component: 'pciProjectUsersOpenstackToken',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        userId,
      ) => PciProjectsProjectUsersService.get(projectId, userId),
      guide: /* @ngInject */ (SessionService, coreConfig) =>
        SessionService.getUser().then(({ ovhSubsidiary }) =>
          get(TOKEN_GUIDE, [coreConfig.getRegion(), ovhSubsidiary]),
        ),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
    },
  });
};
