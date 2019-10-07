import illustration from './assets/streams.gif';

export default class PciStreamsOnboardingController {
  $onInit() {
    this.labAccepted = this.lab.isActivated();
    this.illustration = illustration;
  }

  acceptLab(accepted) {
    this.labAccepted = accepted;
  }
}
