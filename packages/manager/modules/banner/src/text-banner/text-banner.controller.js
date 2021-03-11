import { Environment } from '@ovh-ux/manager-config';

export default class TextBannerController {
  $onInit() {
    const message = Environment.getMessage();
    if (message) {
      const userLanguage = Environment.getUserLanguage();
      this.message = Object.keys(message).includes(userLanguage)
        ? message[userLanguage]
        : this.message.en;
    }
  }
}
