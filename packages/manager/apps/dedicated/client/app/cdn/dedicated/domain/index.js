import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import statisticsModule from './statistics';
import ruleModule from './rule';
import addModule from './add';
import backendUpdateModule from './backend/update';
import deleteModule from './delete';
import flushModule from './flush';
import logsModule from './logs';
import updateModule from './update';

import routing from './cdn-dedicated-domain.routes';
import service from './cdn-dedicated-domain.service';

const moduleName = 'cdnDedicatedDomain';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    statisticsModule,
    ruleModule,
    addModule,
    backendUpdateModule,
    deleteModule,
    flushModule,
    logsModule,
    updateModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('CdnDomain', service);

export default moduleName;
