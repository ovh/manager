import illustration from './assets/serving.png';

export default class PciServingOnboardingController {
  $onInit() {
    this.labAccepted = this.lab.isActivated();
    this.illustration = illustration;
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }
}
