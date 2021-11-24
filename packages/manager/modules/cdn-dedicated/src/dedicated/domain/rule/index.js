import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import activateModule from './activate';
import addModule from './add';
import deactivateModule from './deactivate';
import deleteModule from './delete';
import flushModule from './flush';
import orderModule from './order';
import updateModule from './update';

import routing from './cdn-dedicated-domain-rule.routes';

const moduleName = 'cdnDedicatedDomainRule';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    activateModule,
    addModule,
    deactivateModule,
    deleteModule,
    flushModule,
    orderModule,
    updateModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
