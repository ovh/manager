import { CUSTOM_IMAGE_GUIDES } from './server-installation-choice.constants';

export default class ServerInstallationChoiceCtrl {
  /* @ngInject */
  constructor($state, atInternet, ovhFeatureFlipping, coreConfig) {
    this.$state = $state;
    this.atInternet = atInternet;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
  }

  $onInit() {
    this.loading = true;

    this.statePrefix = this.statePrefix || 'app.dedicated-server.server';

    this.choice = {
      value: 1,
      ovh: 1,
      personal: 2,
      image: 3,
    };
    this.customImageGuide =
      CUSTOM_IMAGE_GUIDES[this.ovhSubsidiary] || CUSTOM_IMAGE_GUIDES.DEFAULT;
    this.loading = false;
  }

  goInstall() {
    if (this.choice.value === this.choice.ovh) {
      this.trackPage(
        `dedicated::dedicated::${this.serverType}::system-install::public-catalog`,
      );
      this.$state.go(`${this.statePrefix}.dashboard.installation-ovh`);
    } else if (this.choice.value === this.choice.gabarit) {
      this.trackPage(
        `dedicated::dedicated::${this.serverType}::system-install::existing-template`,
      );
      this.$state.go(`${this.statePrefix}.dashboard.installation-gabarit`);
    } else if (this.choice.value === this.choice.image) {
      this.trackPage(
        `dedicated::dedicated::${this.serverType}::system-install::personalized-image`,
      );
      this.$state.go(`${this.statePrefix}.dashboard.install.image`);
    }
  }

  trackPage(name) {
    this.atInternet.trackPage({
      name,
      type: 'navigation',
    });
  }
}
