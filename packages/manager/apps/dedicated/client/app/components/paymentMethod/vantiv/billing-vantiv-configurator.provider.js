angular.module('services').provider(
  'BillingVantivConfigurator',
  class BillingVantivConfigurator {
    /* @ngInject */
    constructor(coreConfigProvider) {
      this.coreConfig = coreConfigProvider;
    }

    setScriptUrl(url) {
      if (!this.coreConfig.isRegion('US')) {
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('src', url);
      script.setAttribute('type', 'text/javascript');

      document.body.appendChild(script);
    }

    /* eslint-disable class-methods-use-this */
    $get() {
      return null;
    }
    /* eslint-enable class-methods-use-this */
  },
);
