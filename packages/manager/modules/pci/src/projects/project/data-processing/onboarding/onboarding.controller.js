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
    PciProjectLabsService,
    atInternet,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.$q = $q;
    this.dataProcessingService = dataProcessingService;
    this.pciProjectLabsService = PciProjectLabsService;
    this.atInternet = atInternet;
    this.isActivated = false;
    this.agreedLab = false;
  }

  $onInit() {
    this.illustration = illustration;
    this.isActivated = this.lab.isActivated();
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

  acceptLab(accepted) {
    this.agreedLab = accepted;
  }

  authorizeService() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::data-processing::onboarding::first-job',
      type: 'action',
    });
    let labPromise;
    if (this.agreedLab) {
      labPromise = this.pciProjectLabsService.activateLab(
        this.projectId,
        this.lab,
      );
    } else {
      labPromise = this.$q.resolve();
    }
    return labPromise.then(() => {
      this.dataProcessingService.authorize(this.projectId).then(() => {
        this.goBack();
      });
    });
  }

  onGuideClick(guide) {
    this.atInternet.trackClick({
      name: guide.tracker,
      type: 'action',
    });
  }
}
