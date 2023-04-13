import illustration from './assets/notebooks.png';

export default class EtlOnboardingCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.illustration = illustration;
  }
}
