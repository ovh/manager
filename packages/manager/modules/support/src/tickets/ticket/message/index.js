import angular from 'angular';

import component from './message.component';
import service from './message.service';

import './message.scss';

const moduleName = 'ovhManagerSupportTicketMessage';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .service('ticketMessageService', service);

export default moduleName;
