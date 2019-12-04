import angular from 'angular';

import helper from './helper.service';

const moduleName = 'wucHelper';

angular
  .module(moduleName, [])
  .service('WucHelper', helper);

export default moduleName;
