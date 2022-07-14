import illustration from './assets/objects.png';

import { GUIDES, STANDARD_S3 } from './onboarding.constants';

export default class PciStorageObjectsOnboardingController {
  /* @ngInject */
  constructor($translate, atInternet, coreConfig, ovhFeatureFlipping) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.user = coreConfig.getUser();
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    const standardS3offer = 'object-storage:standard-s3';
    this.ovhFeatureFlipping
      .checkFeatureAvailability(standardS3offer)
      .then((newRegionFeature) =>
        newRegionFeature.isFeatureAvailable(standardS3offer),
      )
      .then((status) => {
        this.isS3User = status;
        const guideList = this.isS3User ? STANDARD_S3 : GUIDES;
        this.illustration = illustration;
        this.guides = guideList.map((guide) => {
          const descriptionKey = `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_description`;
          const description = this.$translate.instant(descriptionKey);
          return {
            ...guide,
            title: this.$translate.instant(
              `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_title`,
            ),
            description: description !== descriptionKey ? description : '',
            link: guide.link[this.user.ovhSubsidiary] || guide.link.DEFAULT,
          };
        });
      });
  }

  onDocumentationClick(guide) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}onboarding::documentation::${guide.title}`,
      type: 'action',
    });
  }
}
