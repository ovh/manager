import angular from 'angular';
import translate from 'angular-translate';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';

import './walkme.less';

import service from './walkme.service';

const moduleName = 'publicCloudWalkMe';

angular
  .module(moduleName, [ngOvhUserPref, translate])
  .service('WalkMe', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
