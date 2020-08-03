/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import angular from 'angular';
import ovhManagerVrack from '@ovh-ux/manager-vrack';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import './index.scss';

angular.module('vrackApp', [ovhManagerVrack]).config(
  /* @ngInject */ ($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  },
);
