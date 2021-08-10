import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

import { OBJECT_CONTAINER_OFFERS } from '../../../containers/containers.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.add', {
    url: '/new',
    component: 'pciProjectStorageContainersAdd',
    resolve: {
      regions: /* @ngInject */ (PciProjectRegions, projectId) =>
        PciProjectRegions.getAvailableRegions(projectId).then((regions) => {
          return OBJECT_CONTAINER_OFFERS.reduce(
            (regionsConfiguration, offerName) => ({
              ...regionsConfiguration,
              [offerName]: map(
                filter(regions, (region) =>
                  some(get(region, 'services', []), {
                    name: offerName,
                    status: 'UP',
                  }),
                ),
                (region) => ({
                  ...region,
                  hasEnoughQuota: () => true,
                }),
              ),
            }),
            {},
          );
        }),
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      cancelCreate: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage', {
          projectId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_containers_add_title',
        ),
    },
    atInternet: {
      rename: 'pci::projects::project::storages::objects::add',
    },
  });
};
