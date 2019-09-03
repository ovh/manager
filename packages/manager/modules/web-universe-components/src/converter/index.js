import angular from 'angular';

import WucConverterFactory from './converter.factory';
import WucConverterService from './converter.service';

const moduleName = 'wucConverter';

angular
  .module(moduleName, [])
  .factory('WucConverterFactory', WucConverterFactory)
  .service('WucConverterService', WucConverterService);

export default moduleName;
