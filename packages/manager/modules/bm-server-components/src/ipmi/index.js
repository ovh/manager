import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';
import ovhManagerCore from '@ovh-ux/manager-core';
import { sshKey } from '@ovh-ux/manager-components';
import IpmiSolAddSsh from './sol/add/sol-add-ssh.module';

import component from './component';
import service from './service';
import polling from '../polling/polling.service';

const moduleName = 'ovhManagerBmServerComponentsIpmiComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    ovhManagerCore,
    IpmiSolAddSsh,
    sshKey,
  ])
  .component('serverIpmi', component)
  .service('IpmiService', service)
  .service('Polling', polling)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
