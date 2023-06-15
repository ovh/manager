import { APP_IMAGE } from '../../add.constants';
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
    this.APP_IMAGE = APP_IMAGE;

    this.docImagesDockerPortfolioUrl =
      APP_DOCKER_IMAGE_PORTFOLIO[this.user.ovhSubsidiary] ||
      APP_DOCKER_IMAGE_PORTFOLIO.DEFAULT;
    this.docDockerBuildUrl =
      APP_CUSTOM_DOCKER_IMAGE_DOC[this.user.ovhSubsidiary] ||
      APP_CUSTOM_DOCKER_IMAGE_DOC.DEFAULT;
  }

  onPresetSelect(preset) {
    this.partnerConditionsAccepted = preset.partner.contract.signedAt !== null;
    this.preset = preset;
  }

  getToSLink() {
    const { termsOfService } = this.preset.partner.contract;
    return (termsOfService[this.language] || termsOfService.default).url;
  }
}
