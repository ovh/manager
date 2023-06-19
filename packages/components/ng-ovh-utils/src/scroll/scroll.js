import angular from 'angular';
import scrollService from './scroll-service';

const moduleName = 'ua.scroll';

angular
  .module(moduleName, ['ui.router'])
  .service('ScrollService', scrollService);

export default moduleName;
