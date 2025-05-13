import configurationOnly from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/configuration-only';

import { registerState } from './configuration-only.routing';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigurationOnly';

angular.module(moduleName, [configurationOnly]).config(registerState);

export default moduleName;
