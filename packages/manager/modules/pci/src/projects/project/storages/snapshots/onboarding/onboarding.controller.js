import reduce from 'lodash/reduce';
import { GUIDES } from './onboarding.constants';

export default class PciStorageSnapshotsOnboardingController {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => ([
        ...list,
        {
          ...guide,
          title: this.$translate.instant(`pci_projects_project_storages_snapshots_onboarding_guides_${guide.id}_title`),
          description: this.$translate.instant(`pci_projects_project_storages_snapshots_onboarding_guides_${guide.id}_description`),
        },
      ]),
      [],
    );
  }
}
