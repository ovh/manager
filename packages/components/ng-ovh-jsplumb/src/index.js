import angular from 'angular';

import endpointDirective from './endpoint/directive';
import instanceDirective from './instance/directive';
import service from './service';

const moduleName = 'ngOvhJsplumb';

angular
  .module(moduleName, [])
  .directive('jsplumbEndpoint', endpointDirective)
  .directive('jsplumbInstance', instanceDirective)
  .service('jsPlumbService', service);

export default moduleName;
