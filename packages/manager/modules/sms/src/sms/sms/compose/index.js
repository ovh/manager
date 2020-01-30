import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-telecom-universe-components';

import {
  component,
  name as componentName,
} from './telecom-sms-sms-compose.component';

import routing from './telecom-sms-sms-compose.routing';

import './addPhonebookContact/telecom-sms-sms-compose-addPhonebookContact.less';

const moduleName = 'ovhManagerSmsSmsCompose';

angular
  .module(moduleName, ['ngOvhTelecomUniverseComponents', 'ui.router'])
  .component(componentName, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
