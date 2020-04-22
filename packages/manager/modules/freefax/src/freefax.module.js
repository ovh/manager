import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-ui-angular';
import '@ovh-ux/manager-telecom-styles';

import '@ovh-ux/manager-core';

import component from './freefaxes.component';
import routing from './freefaxes.routing';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';
import './freefax/freefax.scss';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, ['oc.lazyLoad', 'ovhManagerCore', 'oui', 'ui.router'])
  .config(routing)
  .component('ovhManagerFreefaxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
