import angular from 'angular';

import component from './cloud-connect.component';
// import overview from './overview';
// import details from './details';
import routing from './cloud-connect.routing';
import service from './cloud-connect.service';
// import serviceKeys from './service-keys';
// import tasks from './tasks';

const moduleName = 'ovhCloudConnect';

angular
  .module(moduleName, [
    // overview,
    // serviceKeys,
    // tasks,
    // details,
  ])
  .config(routing)
  .component('cloudConnect', component)
  .service('cloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
