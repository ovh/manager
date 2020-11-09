import get from 'lodash/get';
import { OPENSTACK_GUIDE } from './download-openrc.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.download-openrc', {
    url: '/openrc/download?userId',
    views: {
      modal: {
        component: 'pciProjectUsersDownloadOpenRc',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      currentRegion: /* @ngInject */ (coreConfig) => coreConfig.getRegion(),
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        userId,
      ) => PciProjectsProjectUsersService.get(projectId, userId),
      regions: /* @ngInject */ (PciProjectsProjectUsersService, projectId) =>
        PciProjectsProjectUsersService.getRegions(projectId).then((regions) =>
          regions.map(({ name }) => name),
        ),
      openstackGuide: /* @ngInject */ (SessionService, coreConfig) =>
        SessionService.getUser().then(({ ovhSubsidiary }) =>
          get(OPENSTACK_GUIDE, [coreConfig.getRegion(), ovhSubsidiary]),
        ),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
    },
  });
};
