import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import changePassword from './change-password';
import create from './create';
import accountDelete from './delete';
import exportCsv from './export-csv';
import migrate from './migrate';
import unlock from './unlock';
import update from './update';
import usage from './usage';

const moduleName = 'ovhManagerEmailDomainAccount';

angular.module(moduleName, [
  accountDelete,
  changePassword,
  create,
  exportCsv,
  migrate,
  ngTranslateAsyncLoader,
  'oui',
  'pascalprecht.translate',
  unlock,
  update,
  usage,
]);

export default moduleName;
