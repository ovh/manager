import angular from 'angular';

import Apiv2Service from './apiv2.service';
import GuideService from './guide.service';
import IdentityService from './identity.service';
import PolicyService from './policy.service';

const moduleName = 'ovhManagerIAMServices';

angular
  .module(moduleName, [])
  .service('Apiv2Service', Apiv2Service)
  .service('GuideService', GuideService)
  .service('IdentityService', IdentityService)
  .service('PolicyService', PolicyService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
