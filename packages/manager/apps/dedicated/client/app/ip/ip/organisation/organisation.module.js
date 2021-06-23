import routing from './organisation.routing';
import addEditController from './add-or-edit/ip-ip-organisation-add-or-edit.controller';
import addFormController from './add-or-edit/ip-ip-organisation-add-form.controller';
import addEditTemplate from './add-or-edit/ip-ip-organisation-add-or-edit.html';
import changeController from './change/ip-ip-organisation-change.controller';
import changeTemplate from './change/ip-ip-organisation-change.html';
import deleteController from './delete/ip-ip-organisation-delete.controller';
import deleteTemplate from './delete/ip-ip-organisation-delete.html';
import viewController from './view/ip-ip-organisation-view.controller';
import viewTemplate from './view/ip-ip-organisation-view.html';

const moduleName = 'ovhManagerIpDashboardOrganisation';

angular
  .module(moduleName, [])
  .controller('IpOrganisationAddCtrl', addEditController)
  .controller('IpOrganisationAddFormCtrl', addFormController)
  .controller('IpOrganisationChangeCtrl', changeController)
  .controller('IpOrganisationDeleteCtrl', deleteController)
  .controller('IpOrganisationViewCtrl', viewController)
  .config(routing)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/organisation/add-or-edit/ip-ip-organisation-add-or-edit.html',
        addEditTemplate,
      );
      $templateCache.put(
        'ip/organisation/change/ip-ip-organisation-change.html',
        changeTemplate,
      );
      $templateCache.put(
        'ip/organisation/change/ip-ip-organisation-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'ip/organisation/change/ip-ip-organisation-view.html',
        viewTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
