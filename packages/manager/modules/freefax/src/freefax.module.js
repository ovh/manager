import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-telecom-styles';

import '@ovh-ux/manager-core';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import routing from './freefaxes.routing';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './freefax/freefax.scss';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, [
    'oc.lazyLoad',
    'ovhManagerCore',
    'oui',
    'ui.router',
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
