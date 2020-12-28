import get from 'lodash/get';
import illustration from '../assets/training.png';
import { GUIDES } from './onboarding.constants';

export default class PciServingOnboardingController {
  /* @ngInject */
  constructor($translate, PciProjectLabsService, $q) {
    this.$translate = $translate;
    this.loading = false;
    this.PciProjectLabsService = PciProjectLabsService;
    this.$q = $q;
    this.error = false;
  }

  $onInit() {
    this.labAccepted = this.lab.isActivated();
    this.illustration = illustration;

    this.guides = GUIDES.map((guide) => ({
      ...guide,
      title: this.$translate.instant(
        `pci_projects_project_training_onboarding_guides_${guide.id}_title`,
      ),
      description: this.$translate.instant(
        `pci_projects_project_training_onboarding_guides_${guide.id}_description`,
      ),
    }));
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }

  submit() {
    this.loading = true;
    let labPromise;
    if (this.lab.isOpen()) {
      labPromise = this.PciProjectLabsService.activateLab(
        this.projectId,
        this.lab,
      );
    } else {
      labPromise = this.$q.resolve();
    }

    labPromise
      .then(() => {
        if (this.isAuthorized) {
          return this.submitJobLink();
        }
        return this.createAuthorization();
      })
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
