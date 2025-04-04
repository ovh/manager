import component from './auto-renew-service-modal.component';
import service from './auto-renew-service-modal.service';

const moduleName = 'ovhManagerAutoRenewServiceModalModule';

angular
  .module(moduleName, [])
  .component('ovhAutoRenewServiceModal', component)
  .service('ovhAutoRenewServiceModalService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
