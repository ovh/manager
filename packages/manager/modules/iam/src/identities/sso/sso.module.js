import angular from 'angular';

import component from './sso.component';
import routing from './sso.routing';
import service from './sso.service';

import ssoDetailsController from './details/sso-details.controller';
import ssoDetailsTemplate from './details/sso-details.html';
import ssoAddController from './add/sso-add.controller';
import ssoAddTemplate from './add/sso-add.html';
import ssoUpdateController from './update/sso-update.controller';
import ssoUpdateTemplate from './update/sso-update.html';
import ssoDeleteController from './delete/sso-delete.controller';
import ssoDeleteTemplate from './delete/sso-delete.html';

const moduleName = 'ovhManagerIAMIdentitiesSSO';

angular
  .module(moduleName, [])
  .component('iamSso', component)
  .config(routing)
  .service('IamSsoService', service)
  .controller('IamUsersSsoDetailsCtrl', ssoDetailsController)
  .controller('IamUsersSsoAddCtrl', ssoAddController)
  .controller('IamUsersSsoUpdateCtrl', ssoUpdateController)
  .controller('IamUsersSsoDeleteCtrl', ssoDeleteController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'iam/identities/sso/details/sso-details.html',
        ssoDetailsTemplate,
      );
      $templateCache.put(
        'iam/identities/sso/update/sso-update.html',
        ssoUpdateTemplate,
      );
      $templateCache.put('iam/identities/sso/add/sso-add.html', ssoAddTemplate);
      $templateCache.put(
        'iam/identities/sso/delete/sso-delete.html',
        ssoDeleteTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
