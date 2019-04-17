import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'ovh-ui-kit/dist/oui.css';
import '@ovh-ux/manager-adp';
import ovhManagerCore from '@ovh-ux/manager-core';

import './adp.less';

import angular from 'angular';

angular.module('adpApp', ['ovhManagerAdp', ovhManagerCore])
  .config(TranslateServiceProvider => TranslateServiceProvider.setUserLocale('en_GB'));
