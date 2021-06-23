import deleteController from './delete/ip-ip-block-delete.controller';
import deleteTemplate from './delete/ip-ip-block-delete.html';
import descriptionEditController from './description/edit/ip-ip-block-description-edit.controller';
import descriptionEditTemplate from './description/edit/ip-ip-block-description-edit.html';
import moveController from './move/ip-ip-block-move.controller';
import moveTemplate from './move/ip-ip-block-move.html';

const moduleName = 'ovhManagerIpDashboardBlock';

angular
  .module(moduleName, [])
  .controller('IpDeleteIpBlockCtrl', deleteController)
  .controller('IpEditIpDescriptionCtrl', descriptionEditController)
  .controller('IpMoveIpBlockCtrl', moveController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/block/delete/ip-ip-block-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'ip/block/description/edit/ip-ip-block-description-edit.html',
        descriptionEditTemplate,
      );
      $templateCache.put('ip/block/move/ip-ip-block-move.html', moveTemplate);
    },
  );

export default moduleName;
