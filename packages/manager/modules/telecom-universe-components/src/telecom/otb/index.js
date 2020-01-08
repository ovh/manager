import angular from 'angular';
import 'ovh-api-services';

import TucOverTheBoxMediator from './over-the-box-mediator.service';

const moduleName = 'tucTelecomOtb';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('TucOverTheBoxMediator', TucOverTheBoxMediator);

export default moduleName;
