import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './sol-add-ssh.controller';
import template from './sol-add-ssh.html';

const moduleName = 'ovhManagerBmServerComponentsIpmiSolAddSsh';

angular
  .module(moduleName, [angularTranslate, ngAtInternet, 'oui', uiRouter])
  .controller('BmServerAddSolSsh', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'bm-server-components/ipmi/sol/add/sol-add-ssh.html',
        template,
      );
    },
  );

export default moduleName;
