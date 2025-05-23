import descriptionEditController from './description/edit/ip-ip-block-description-edit.controller';
import descriptionEditTemplate from './description/edit/ip-ip-block-description-edit.html';
import moveController from './move/ip-ip-block-move.controller';
import moveTemplate from './move/ip-ip-block-move.html';
import editAssociateController from './editAssociate/ip-ip-block-edit-associate.controller';
import editAssociateTemplate from './editAssociate/ip-ip-block-edit-associate.html';

const moduleName = 'ovhManagerIpDashboardBlock';

angular
  .module(moduleName, [])
  .controller('IpEditIpDescriptionCtrl', descriptionEditController)
  .controller('IpMoveIpBlockCtrl', moveController)
  .controller('IpEditIpAssociateCtrl', editAssociateController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/block/description/edit/ip-ip-block-description-edit.html',
        descriptionEditTemplate,
      );
      $templateCache.put('ip/block/move/ip-ip-block-move.html', moveTemplate);
      $templateCache.put(
        'ip/block/editAssociate/ip-ip-block-edit-associate.html',
        editAssociateTemplate,
      );
    },
  );

export default moduleName;
