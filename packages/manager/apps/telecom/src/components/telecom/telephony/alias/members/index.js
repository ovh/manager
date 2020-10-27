import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import serviceChoicePopoverComponent from '../../service/choice-popover';

import component from './members.component';
import addComponent from './add/add.component';

import './members.less';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyAliasMembers';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceChoicePopoverComponent,
  ])
  .component('telecomTelephonyAliasMembers', component)
  .component('telecomTelephonyAliasMembersAdd', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
