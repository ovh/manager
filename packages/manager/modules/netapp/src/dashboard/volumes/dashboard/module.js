import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import { inlinePropertyEditor } from '@ovh-ux/manager-components';

import component from './component';
import routing from './routing';

import aclModule from './acl';
import snapshotsModule from './snapshots';
import editSize from './edit-size';
import editReserveSpace from './edit-reserve-space';

const moduleName = 'ovhManagerNetAppVolumesDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    inlinePropertyEditor,
    aclModule,
    snapshotsModule,
    editSize,
    editReserveSpace,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumesDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
