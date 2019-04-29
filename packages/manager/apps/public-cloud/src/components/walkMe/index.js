import angular from 'angular';
import translate from 'angular-translate';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!bootstrap-tour/build/js/bootstrap-tour-standalone.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'bootstrap-tour/build/css/bootstrap-tour.min.css';
import './walkme.less';

import service from './walkme.service';

const moduleName = 'publicCloudWalkMe';

angular
  .module(moduleName, [
    ngOvhUserPref,
    translate,
  ])
  .service('WalkMe', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
