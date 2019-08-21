import angular from 'angular';

import component from './message.component';
import service from './message.service';
import htmlStringLinky from './helpers/message.linky';

import './message.scss';

const moduleName = 'ovhManagerSupportTicketMessage';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .filter('htmlStringLinky', htmlStringLinky)
  .service('ticketMessageService', service);

export default moduleName;
