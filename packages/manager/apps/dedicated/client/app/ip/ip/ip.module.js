import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import routing from './ip-dashboard.routing';

import antihack from './antihack/antihack.module';
import antispam from './antispam/antispam.module';
import arp from './arp/arp.module';
import block from './block/block.module';
import exportCsv from './export-csv/export-csv.module';
import firewall from './firewall/firewall.module';
import mitigation from './mitigation/mitigation.module';
import organisation from './organisation/organisation.module';
import reverse from './reverse/reverse.module';
import virtualMac from './virtual-mac/virtual-mac.module';

import ipService from './ip-ip.service';
import ipExpandService from './ip-ip-expand-ipv6.service';
import popoverIpTemplate from './popover/ip.html';
import popoverIpBlockTemplate from './popover/ipBlock.html';

const moduleName = 'ovhManagerIpDashboard';

angular
  .module(moduleName, [
    antihack,
    antispam,
    arp,
    block,
    exportCsv,
    firewall,
    mitigation,
    ngOvhFeatureFlipping,
    organisation,
    reverse,
    virtualMac,
  ])
  .config(routing)
  .service('Ip', ipService)
  .service('IpExpandIpv6', ipExpandService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/ip/popover/ip.html', popoverIpTemplate);
      $templateCache.put('ip/ip/popover/ipBlock.html', popoverIpBlockTemplate);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./reverse/update/translations */);

export default moduleName;
