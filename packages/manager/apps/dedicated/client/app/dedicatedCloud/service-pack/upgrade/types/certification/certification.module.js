import certification from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/certification';

import { registerState } from './certification.routing';

const moduleName = 'ovhManagerPccServicePackUpgradeCertification';

angular.module(moduleName, [certification]).config(registerState);

export default moduleName;
