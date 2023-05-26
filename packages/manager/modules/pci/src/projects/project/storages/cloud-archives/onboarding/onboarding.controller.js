import reduce from 'lodash/reduce';
import illustration from './assets/cloud-archives.png';

import { GUIDES } from './onboarding.constants';

export default class PciStorageCloudArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.illustration = illustration;
    const guideKey =
      'pci_projects_project_storages_cloud_archives_onboarding_guides_';
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          id: guide.id,
          link: guide.link[this.user.ovhSubsidiary] || guide.link.DEFAULT,
          title: this.$translate.instant(`${guideKey}${guide.id}_title`),
          description: this.$translate.instant(
            `${guideKey}${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }
}
