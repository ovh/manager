import {
  // FORMAT_DURATION_TRACKING_ORDER,
  // FORMAT_UNIT_CAPACITY_TRACKING_ORDER,
  PREFIX_TRACKING_ORDER,
} from './order.constants';

export default class NashaOrderController {
  /* @ngInject */
  constructor(coreConfig, coreURLBuilder) {
    this.nashaRoot = coreURLBuilder.buildURL('dedicated', '#/nasha');
    this.user = coreConfig.getUser();
    this.userLocale = coreConfig.getUserLocale();
  }

  $onInit() {
    const element = document.getElementById('nasha-order-container');

    this.setupNasHa(element, {
      options: {
        assets: {
          flagsPath: '/assets/flags',
        },
        language: this.userLocale,
        subsidiary: this.user.ovhSubsidiary,
        express: {
          // openTarget: '_top',
          backUrl: this.nashaPublicUrl,
        },
        navbar: {
          enable: true,
          backUrl: this.nashaRoot,
        },
        cart: {
          enable: true,
        },
      },
      callbacks: {
        error: () => {},
        ready: () => {},
        update: () => {},
        navigation: (ne) => {
          switch (ne.action) {
            case 'order':
              this.trackClick(PREFIX_TRACKING_ORDER, 'confirm');
              this.goToNasha();
              break;
            case 'leave':
              this.trackClick(PREFIX_TRACKING_ORDER, 'cancel');
              break;
            default:
              break;
          }
        },
      },
      parameters: null,
      selections: null,
    });
  }
}
