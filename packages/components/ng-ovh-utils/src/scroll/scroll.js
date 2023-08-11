import angular from 'angular';
import scrollService from './scroll-service';
import scrollTopDirective from './scroll-directive';

const moduleName = 'ua.scroll';

angular
  .module(moduleName, ['ui.router'])
  .service('ScrollService', scrollService)
  .directive('ovhScrollTop', scrollTopDirective);

export default moduleName;
