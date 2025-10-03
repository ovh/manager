import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import create from './create';
import edit from './edit';
import filterDelete from './delete';
import routing from './filter.routing';

const moduleName = 'ovhManagerEmailDomainDashboardEmailFilter';

angular
  .module(moduleName, [
    create,
    edit,
    filterDelete,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
