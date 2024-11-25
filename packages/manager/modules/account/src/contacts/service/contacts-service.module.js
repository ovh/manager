import component from './contacts-service.component';
import routing from './user-contacts-service.routes';
import service from './contacts-service.service';

import edit from './edit/edit.module';

const moduleName = 'ovhManagerDedicatedAccountContactsService';

angular
  .module(moduleName, [edit])
  .config(routing)
  .component('accountContactsService', component)
  .service('AccountContactsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
