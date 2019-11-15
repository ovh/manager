import angular from 'angular';


import component from './lines.component';
import routing from './lines.routing';
// import service from './lines.service';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccountLines';

angular
  .module(moduleName, [])
  .config(routing)
  .component('telecomTelephonyBillingAccountLines', component);
// .service('TelecomTelephonyBillingAccountLinesService', service);

export default moduleName;
