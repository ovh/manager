import angular from 'angular';
import '@uirouter/angularjs';

import serviceAssistSupport from '../../../service/assist/support';

import routing from './support.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxAssistSupport';

angular.module(moduleName, ['ui.router', serviceAssistSupport]).config(routing);

export default moduleName;
