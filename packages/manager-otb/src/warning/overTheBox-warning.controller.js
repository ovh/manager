import angular from 'angular';

const moduleName = 'ovhManagerOtbWarning';

angular.module(moduleName, [])
  .controller('OrderOverTheBoxWarningCtrl', function orderOverTheBoxWarningCtrl(URLS, REDIRECT_URLS) {
    this.overTheBoxManager = URLS.overTheBoxManager;
    this.guide = URLS.guides.overTheBox;
    this.home = URLS.guides.home;
    this.paymentMeans = REDIRECT_URLS.paymentMeans;
  });

export default moduleName;
