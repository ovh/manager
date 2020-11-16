import basicOptionsModule from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/basicOptions';

import { registerState } from './basicOptions.routing';

const moduleName = 'ovhManagerPccServicePackUpgradeBasicOptions';

angular.module(moduleName, [basicOptionsModule]).config(registerState);

export default moduleName;
