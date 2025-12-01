import angular from 'angular';
import { oui } from '@ovh-ux/ui-kit';
import component from './reason-warning-modal.component';
import service from './reasons.service';

const moduleName = 'ovhManagerReasonWarningModal';

angular
  .module(moduleName, [oui])
  .component(component.name, component)
  .service('reasonService', service);

export default moduleName;
