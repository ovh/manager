import { Environment } from '@ovh-ux/manager-config';
import { FAQ } from './status.constants';

export default class StatusController {
  $onInit() {
    this.filtersOptions = {
      status: {
        hideOperators: true,
        values: this.translatedStatusEnum,
      },
      products: {
        hideOperators: true,
        values: this.translatedServiceEnum,
      },
    };

    this.faqLink = FAQ[Environment.getUserLocale()] || FAQ.en_GB;
  }
}
