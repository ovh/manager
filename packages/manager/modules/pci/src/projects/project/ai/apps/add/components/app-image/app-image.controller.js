import { APP_IMAGE } from '../../add.constants';
import {
  APP_CUSTOM_DOCKER_IMAGE_DOC,
  APP_DOCKER_IMAGE_PORTFOLIO,
} from '../../../app.constants';

export default class AppImageController {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.showAdvancedImage = false;
    this.APP_IMAGE = APP_IMAGE;

    this.docImagesDockerPortfolioUrl =
      APP_DOCKER_IMAGE_PORTFOLIO[this.user.ovhSubsidiary] ||
      APP_DOCKER_IMAGE_PORTFOLIO.DEFAULT;
    this.docDockerBuildUrl =
      APP_CUSTOM_DOCKER_IMAGE_DOC[this.user.ovhSubsidiary] ||
      APP_CUSTOM_DOCKER_IMAGE_DOC.DEFAULT;
  }

  onClickAdvancedImage() {
    this.image = null;
    this.selected = null;
    this.preset = null;
    this.showAdvancedImage = !this.showAdvancedImage;
  }

  onPresetSelect(preset) {
    this.image = preset.id;
    this.preset = preset;
    this.showAdvancedImage = false;
  }
}
