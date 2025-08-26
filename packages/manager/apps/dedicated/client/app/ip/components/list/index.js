import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import antihack from './antihack/antihack.module';
import antispam from './antispam/antispam.module';
import arp from './arp/arp.module';
import associateIpBloc from './associate-ip-bloc/associate-ip-bloc.module';
import block from './block/block.module';
import byoip from './byoip/byoip.module';
import exportCsv from './export-csv/export-csv.module';
import firewall from './firewall/firewall.module';
import organisation from './organisation/organisation.module';
import reverse from './reverse/reverse.module';
import virtualMac from './virtual-mac/virtual-mac.module';

import popoverIpTemplate from './popover/ip.html';
import popoverIpBlockTemplate from './popover/ipBlock.html';
import popoverAdditionalIpV6Template from './popover/additional-ipv6.html';

import component from './list.component';

const moduleName = 'ovhManagerIpComponentsList';

angular
  .module(moduleName, [
    antihack,
    antispam,
    arp,
    associateIpBloc,
    block,
    byoip,
    exportCsv,
    firewall,
    ngOvhFeatureFlipping,
    organisation,
    reverse,
    virtualMac,
  ])
  .component('ipList', component)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('ip/popover/ip.html', popoverIpTemplate);
      $templateCache.put('ip/popover/ipBlock.html', popoverIpBlockTemplate);
      $templateCache.put(
        'ip/popover/additional-ipv6.html',
        popoverAdditionalIpV6Template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./reverse/update/translations */);

export default moduleName;
