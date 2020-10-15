import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import abbreviatedNumbers from './abbreviatedNumbers';
import callWaiting from './callWaiting';
import displayNumber from './displayNumber';
import click2Call from './click2Call';
import events from './events';
import externalNumber from './externalNumber';
import filtering from './filtering';
import forward from './forward';
import lockOutCall from './lockOutCall';
import simultaneousLines from './simultaneousLines';
import timeCondition from './timeCondition';

import routing from './calls.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    abbreviatedNumbers,
    callWaiting,
    click2Call,
    displayNumber,
    events,
    externalNumber,
    filtering,
    forward,
    lockOutCall,
    simultaneousLines,
    timeCondition,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
