import reduce from 'lodash/reduce';
import illustration from './assets/databases.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_database_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_database_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  onAddDatabaseClick() {
    this.trackDatabases('onboarding_create_database');
    this.goToAddDatabase();
  }

  onDocumentationClick(guide) {
    this.trackDatabases(`guide::${guide.id}`);
  }
}
