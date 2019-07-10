// import wuc from '@ovh-ux/ng-ovh-web-universe-components';

import service from './navbar.service';

const moduleName = 'webManagerNavbar';

angular.module(moduleName, [
  // wuc,
])
  .service('webNavbar', service);

export default moduleName;
