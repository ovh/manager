import reduce from 'lodash/reduce';
import illustration from './assets/databases.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          link: guide.links[this.user.ovhSubsidiary] || guide.links.DEFAULT,
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
