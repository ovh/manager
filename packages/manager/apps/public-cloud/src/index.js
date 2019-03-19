import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import navbar from './navbar';
import sidebar from './sidebar';

import './index.scss';

import controller from './index.controller';
import service from './index.service';

angular
  .module('ovhStack', [
    ovhManagerCore,
    navbar,
    ngOvhApiWrappers,
    sidebar,
  ])
  .controller('PublicCloudController', controller)
  .service('publicCloud', service)
  .run(/* @ngTranslationsInject:json ./translations */);
