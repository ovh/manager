import { CHECK_PRICES_DOC_LINK } from './add.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archive.add', {
    url: '/new',
    component: 'pciProjectsProjectStoragesColdArchiveAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_cold_archive_add_breadcrumb',
        ),

      checkPricesLink: /* @ngInject */ (coreConfig) =>
        CHECK_PRICES_DOC_LINK[coreConfig.getUser().ovhSubsidiary] ||
        CHECK_PRICES_DOC_LINK.DEFAULT,

      stepper: /* @ngInject */ () => ({
        nameArchiveStep: { name: 'cold_archive_name_archive', display: null },
      }),
    },
  });
};
