import angular from 'angular';

import component from './support.component';
import ticket from './ticket';
import tickets from './tickets';

import { registerState } from './support.routing';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import './support.scss';

const moduleName = 'ovhManagerSupport';
angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    ticket,
    tickets,
    'ui.router',
  ])
  .config(registerState)
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
