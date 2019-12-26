import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import backupTemplate from './backup.html';

import './backup.less';

const moduleName = 'ovhManagerPciInstancesHelp';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'pci/projects/project/instances/help/backup.html',
        backupTemplate,
      );
    },
  );

export default moduleName;
