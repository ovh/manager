import angular from 'angular';

import addModule from './add/license-spla-add.module';
import revokeModule from './revoke/license-spla-revoke.module';

const moduleName = 'licenseSpla';

angular.module(moduleName, [addModule, revokeModule]);

export default moduleName;
