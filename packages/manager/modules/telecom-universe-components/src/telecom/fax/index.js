import angular from 'angular';
import 'ovh-api-services';

import TucFaxMediator from './fax-mediator.service';

const moduleName = 'tucTelecomFax';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('TucFaxMediator', TucFaxMediator);

export default moduleName;
