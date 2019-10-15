import {
  name as serviceName,
  PreferenceService,
} from './preference.service';

const moduleName = 'ovhManagerServicePackUpgradePreference';

angular
  .module(moduleName, [])
  .service(serviceName, PreferenceService);

export default moduleName;
