import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import controller from './private-database-oom.controller';
import service from './private-database-oom.service';
import template from './private-database-oom.html';

const moduleName = 'ovhManagerPrivateDatabaseOom';

angular
  .module(moduleName, ['oui', 'ui.router', 'ngOvhUtils'])
  .service('PrivateDatabaseOomService', service)
  .controller('PrivateDatabaseOomCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'private-database/oom/private-database-oom.html',
        template,
      );
    },
  );

export default moduleName;
