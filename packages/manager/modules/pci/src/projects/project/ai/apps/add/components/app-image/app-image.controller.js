import {
  APP_IMAGE,
  APP_IMAGE_DOCKER_ARCHITECTURE,
  splitIntoArray,
} from '../../add.constants';
import {
  APP_CUSTOM_DOCKER_IMAGE_DOC,
  APP_DOCKER_IMAGE_PORTFOLIO,
} from '../../../app.constants';

export default class AppImageController {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
    this.language = coreConfig.getUserLocale();
  }

  $onInit() {
    this.commandInArguments = [];
    this.APP_IMAGE = APP_IMAGE;
    this.APP_IMAGE_DOCKER_ARCHITECTURE = APP_IMAGE_DOCKER_ARCHITECTURE;
    this.docImagesDockerPortfolioUrl =
      APP_DOCKER_IMAGE_PORTFOLIO[this.user.ovhSubsidiary] ||
      APP_DOCKER_IMAGE_PORTFOLIO.DEFAULT;
    this.docDockerBuildUrl =
      APP_CUSTOM_DOCKER_IMAGE_DOC[this.user.ovhSubsidiary] ||
      APP_CUSTOM_DOCKER_IMAGE_DOC.DEFAULT;
    if (this.command) {
      this.customDockerCommand = true;
      this.splitStringCommandIntoArray();
    }
  }

  onPresetSelect(preset) {
    this.partnerConditionsAccepted = preset.partner.contract.signedAt !== null;
    this.preset = preset;
  }

  getToSLink() {
    const { termsOfService } = this.preset.partner.contract;
    return (termsOfService[this.language] || termsOfService.default).url;
  }

  splitStringCommandIntoArray() {
    this.commandInArguments = splitIntoArray(this.command);
  }

  onDockerCommandChanged() {
    if (this.customDockerCommand) {
      this.command = null;
      this.commandInArguments = [];
    }
  }
}
