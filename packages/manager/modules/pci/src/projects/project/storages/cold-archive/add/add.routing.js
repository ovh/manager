import {
  COLD_ARCHIVE_TRACKING,
  GUIDE_MENU_ITEMS,
  COLD_ARCHIVE_STATES,
} from '../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.CONTAINER_ADD, {
    url: '/new',
    views: {
      'coldArchiveView@pci.projects.project.storages.cold-archive': {
        component: 'pciProjectsProjectStoragesColdArchiveAdd',
      },
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}`,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_cold_archive_add_breadcrumb',
        ),

      guideMenu: /* @ngInject */ (coreConfig, $translate) => {
        return GUIDE_MENU_ITEMS.reduce(
          (list, guide) => [
            ...list,
            {
              ...guide,
              title: $translate.instant(
                `pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
              ),
              description: $translate.instant(
                `pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
              ),
              link:
                guide.links[coreConfig.getUser()?.ovhSubsidiary] ||
                guide.links.DEFAULT,
            },
          ],
          [],
        );
      },

      onGuideClick: /* @ngInject */ (atInternet) => (guideId) => {
        const hit = `${COLD_ARCHIVE_TRACKING.GUIDE}_${guideId}`;
        return atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },

      stepper: /* @ngInject */ () => ({
        nameArchiveStep: {
          name: 'cold_archive_name_archive',
          display: null,
        },
        linkUserArchiveStep: {
          name: 'cold_archive_link_user_archive',
          display: null,
        },
      }),
    },
  });
};
