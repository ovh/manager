export default class AppImageController {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.showAdvancedImage = false;
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
