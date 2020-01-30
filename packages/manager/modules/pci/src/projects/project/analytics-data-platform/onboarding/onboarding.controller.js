import reduce from 'lodash/reduce';
import illustration from './assets/analytics-data-platform.png';
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
            `analytics_data_platform_onboarding_guides_${guide.id}_title`,
          ),
          description: '',
        },
      ],
      [],
    );
  }
}
