import reduce from 'lodash/reduce';
import illustration from './assets/data-processing.png';
import { GUIDES, SPARK_URL } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor($translate, $state, $q, dataProcessingService, atInternet) {
    this.$translate = $translate;
    this.$state = $state;
    this.$q = $q;
    this.dataProcessingService = dataProcessingService;
    this.atInternet = atInternet;
    this.isActivating = false;
  }

  $onInit() {
    this.illustration = illustration;
    this.sparkUrl = SPARK_URL;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `data_processing_onboarding_guides_${guide.id}_title`,
          ),
          description: '',
        },
      ],
      [],
    );
  }

  authorizeService() {
    this.isActivating = true;
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::onboarding::first-job',
      type: 'action',
    });
    this.dataProcessingService
      .authorize(this.projectId)
      .then(() => {
        this.goBack();
      })
      .finally(() => {
        this.isActivating = false;
      });
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }
}
