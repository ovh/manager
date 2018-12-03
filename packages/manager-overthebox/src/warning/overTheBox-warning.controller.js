import angular from 'angular';

const moduleName = 'ovhManagerOtbWarning';

angular.module(moduleName, [])
  .controller('OrderOverTheBoxWarningCtrl', function orderOverTheBoxWarningCtrl(CORE_URLS, CORE_REDIRECT_URLS) {
    this.overTheBoxManager = CORE_URLS.overTheBoxManager;
    this.guide = CORE_URLS.guides.overTheBox;
    this.home = CORE_URLS.guides.home;
    this.paymentMeans = CORE_REDIRECT_URLS.paymentMeans;
  });

export default moduleName;
