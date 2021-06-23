import controller from './ip-ip-antispam.controller';
import detailsController from './detail/ip-ip-antispam-detail.controller';
import detailsTemplate from './detail/ip-ip-antispam-detail.html';
import routing from './antispam.routing';
import service from './ip-ip-antispam.service';

const moduleName = 'ovhManagerIpDashboardAntispam';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('IpAntispamCtrl', controller)
  .controller('IpAntispamDetailsCtrl', detailsController)
  .service('IpSpam', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'ip/antispam/detail/ip-ip-antispam-detail.html',
        detailsTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
