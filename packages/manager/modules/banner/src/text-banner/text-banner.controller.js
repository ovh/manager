export default class TextBannerController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    const message = this.coreConfig.getMessage();
    if (message) {
      const userLanguage = this.coreConfig.getUserLanguage();
      this.message = Object.keys(message).includes(userLanguage)
        ? message[userLanguage]
        : this.message.en;
    }
  }
}
