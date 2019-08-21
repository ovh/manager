import angular from 'angular';

import ovhUxNgTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouterAngularJs from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import tickets from './tickets';

import component from './support.component';
import { registerState } from './support.routing';

import 'font-awesome/css/font-awesome.css';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import './support.scss';

const moduleName = 'ovhManagerSupport';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ovhUxNgTranslateAsyncLoader,
    tickets,
    uiRouterAngularJs,
  ])
  .config(registerState)
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
