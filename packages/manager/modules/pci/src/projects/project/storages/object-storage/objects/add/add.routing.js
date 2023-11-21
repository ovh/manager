import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

import { OBJECT_CONTAINER_OFFERS } from '../../../containers/containers.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.object-storage.add', {
    url: '/new',
    views: {
      'objectStorageView@pci.projects.project.storages.object-storage': {
        component: 'pciProjectStorageContainersAdd',
      },
    },
    resolve: {
      regions: /* @ngInject */ (PciProjectRegions, projectId) =>
        PciProjectRegions.getAvailableRegions(projectId).then((regions) => {
          // @TODO: GS remove Mock
          regions.push({
            name: 'MAD',
            continentCode: 'EU',
            datacenterLocation: 'MAD',
            status: 'UP',
            services: [
              {
                name: 'key-manager',
                status: 'UP',
                endpoint: 'https://key-manager.gra.cloud.ovh.net',
              },
              {
                name: 'storage-s3-high-perf',
                status: 'UP',
                endpoint: 'https://s3.gra.perf.cloud.ovh.net/',
              },
              {
                name: 'storage-s3-standard',
                status: 'UP',
                endpoint: 'https://s3.gra.io.cloud.ovh.net/',
              },
              {
                name: 'storage',
                status: 'UP',
                endpoint:
                  'https://storage.gra.cloud.ovh.net/v1/AUTH_5a6980507c0a40dca362eb9b22d79044',
              },
            ],
            ipCountries: [],
          });
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
