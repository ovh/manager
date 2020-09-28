import angular from 'angular';

import component from './cloud-connect.component';
import details from './details';
import routing from './cloud-connect.routing';
import service from './cloud-connect.service';

const moduleName = 'ovhCloudConnect';

angular
  .module(moduleName, [details])
  .config(routing)
  .component('cloudConnect', component)
  .service('cloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
