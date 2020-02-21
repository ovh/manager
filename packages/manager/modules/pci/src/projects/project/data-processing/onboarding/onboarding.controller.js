import reduce from 'lodash/reduce';
import illustration from './assets/data-processing.png';
import { GUIDES } from './onboarding.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $state,
    $q,
    dataProcessingService,
    PciProjectLabsService,
  ) {
    this.$translate = $translate;
    this.$state = $state;
    this.$q = $q;
    this.dataProcessingService = dataProcessingService;
    this.pciProjectLabsService = PciProjectLabsService;
    this.isActivated = false;
    this.agreedLab = false;
  }

  $onInit() {
    this.illustration = illustration;
    this.isActivated = this.lab.isActivated();
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

  acceptLab(accepted) {
    this.agreedLab = accepted;
  }

  authorizeService() {
    let labPromise;
    if (this.agreedLab) {
      labPromise = this.pciProjectLabsService.activateLab(
        this.projectId,
        this.lab,
      );
    } else {
      labPromise = this.$q.resolve();
    }
    labPromise.then(() => {
      this.dataProcessingService.authorize(this.projectId).then(() => {
        this.$state.go(
          'pci.projects.project.data-processing',
          {},
          { reload: true },
        );
      });
    });
  }
}
