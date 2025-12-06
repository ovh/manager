import angular from 'angular';
import { oui } from '@ovh-ux/ui-kit';
import component from './debt-warning-modal.component';

const moduleName = 'ovhManagerDebtWarningModal';

angular.module(moduleName, [oui]).component(component.name, component);

export default moduleName;
