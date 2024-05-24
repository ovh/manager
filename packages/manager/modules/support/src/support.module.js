import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import tickets from './tickets';

import component from './support.component';
import { state } from './support.routing';

import 'font-awesome/css/font-awesome.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import modalBetaHelpcenter from './modal';

import './support.scss';

const moduleName = 'ovhManagerSupport';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    tickets,
    uiRouter,
    modalBetaHelpcenter,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  )
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
