import reduce from 'lodash/reduce';
import illustration from './assets/notebooks.png';
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
            `pci_notebook_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_notebook_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  onAddNotebookClick() {
    this.trackNotebooks('onboarding_create_notebook');
    this.goToAddNotebook();
  }

  onDocumentationClick(guide) {
    this.trackNotebooks(`guide::${guide.id}`);
  }
}
