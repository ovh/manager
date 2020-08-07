import { GUIDE_URL } from '../../training.constants';

export default class PciTrainingInstallController {
  $onInit() {
    this.guideUrl = GUIDE_URL;
    // eslint-disable-next-line prefer-destructuring
    this.currentRegion = this.regions[0];
    this.osInstall = {
      Linux: `curl ${this.currentRegion.cliInstallUrl} | sh`,
      'Mac OS': `curl ${this.currentRegion.cliInstallUrl} | sh`,
      Windows: `curl ${this.currentRegion.cliInstallUrl} | sh`,
    };
    this.documentationLink = this.currentRegion.documentationUrl;
  }
}
