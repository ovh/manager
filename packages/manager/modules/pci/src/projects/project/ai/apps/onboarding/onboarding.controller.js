import reduce from 'lodash/reduce';
import get from 'lodash/get';
import illustration from './assets/serving.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, AppService) {
    this.$q = $q;
    this.$translate = $translate;
    this.AppService = AppService;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(`pci_app_guides_${guide.id}_title`),
          description: this.$translate.instant(
            `pci_app_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  onAddAppClick() {
    this.trackApps('onboarding_create_app');

    this.loading = true;
    this.$q
      .resolve(this.isAuthorized)
      .then((isAuthorized) => {
        if (!isAuthorized) return this.AppService.authorized(this.projectId);

        return this.$q.resolve();
      })
      .then(() => this.goToAddApp())
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onDocumentationClick(guide) {
    this.trackApps(`guide::${guide.id}`);
  }
}
