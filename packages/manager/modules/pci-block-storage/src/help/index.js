import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import snapshotTemplate from './snapshot.html';

import './snapshot.less';

const moduleName = 'ovhManagerPciStoragesBlocksHelp';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'pci/projects/project/storages/blocks/help/snapshot.html',
        snapshotTemplate,
      );
    },
  );

export default moduleName;
