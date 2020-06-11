import reduce from 'lodash/reduce';
import illustration from './assets/data-processing.png';
import { GUIDES, SPARK_URL } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    $q,
    dataProcessingService,
    atInternet,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.$q = $q;
    this.dataProcessingService = dataProcessingService;
    this.atInternet = atInternet;
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
    this.atInternet.trackPage({
      name: 'public-cloud::pci::projects::project::data-processing::onboarding',
    });
  }

  authorizeService() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::onboarding::first-job',
      type: 'action',
    });
    this.dataProcessingService.authorize(this.projectId).then(() => {
      this.goBack();
    });
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }
}
