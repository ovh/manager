import reduce from 'lodash/reduce';
import get from 'lodash/get';
import illustration from './assets/notebooks.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, NotebookService) {
    this.$q = $q;
    this.$translate = $translate;
    this.NotebookService = NotebookService;
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

    this.loading = true;
    this.$q
      .resolve(this.isAuthorized)
      .then((isAuthorized) => {
        if (!isAuthorized)
          return this.NotebookService.authorized(this.projectId);

        return this.$q.resolve();
      })
      .then(() => this.goToAddNotebook())
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onDocumentationClick(guide) {
    this.trackNotebooks(`guide::${guide.id}`);
  }
}
