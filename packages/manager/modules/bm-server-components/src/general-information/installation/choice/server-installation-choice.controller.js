import { BYOI_FEATURE } from './server-installation-choice.constants';

export default class ServerInstallationChoiceCtrl {
  /* @ngInject */
  constructor($state, atInternet, ovhFeatureFlipping) {
    this.$state = $state;
    this.atInternet = atInternet;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
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

    return this.ovhFeatureFlipping
      .checkFeatureAvailability(BYOI_FEATURE)
      .then((byoiFeatureResult) => {
        this.isByoiAvailable = byoiFeatureResult.isFeatureAvailable(
          BYOI_FEATURE,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  goInstall() {
    if (this.choice.value === this.choice.ovh) {
      this.trackPage(
        `dedicated::dedicated::${
          this.serverIsNode ? 'node' : 'server'
        }::system-install::public-catalog`,
      );
      this.$state.go(`${this.statePrefix}.dashboard.installation-ovh`);
    } else if (this.choice.value === this.choice.gabarit) {
      this.trackPage(
        `dedicated::dedicated::${
          this.serverIsNode ? 'node' : 'server'
        }::system-install::existing-template`,
      );
      this.$state.go(`${this.statePrefix}.dashboard.installation-gabarit`);
    } else if (this.choice.value === this.choice.image) {
      this.trackPage(
        `dedicated::dedicated::${
          this.serverIsNode ? 'node' : 'server'
        }::system-install::personalized-image`,
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
