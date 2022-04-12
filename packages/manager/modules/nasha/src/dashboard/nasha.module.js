import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-filters';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-doc-url';
import '@ovh-ux/ng-ovh-responsive-popover';
import '@ovh-ux/ng-ui-router-layout';

import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import NashaCtrl from './controller';

import informationTemplate from '../information/nasha-information.html';
import usageHelpTemplate from '../information/nasha-information-usage-help.html';

import partition from '../partition';
import routing from './routing';
import cucAutoComplete from '../components/autocomplete';
import cucSpaceMeter from '../components/space-meter';

import './styles.less';

const moduleName = 'ovhManagerNashaDashboard';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ovhManagerFilters',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'ngOvhCloudUniverseComponents',
    'ngOvhDocUrl',
    'ngUiRouterLayout',
    'ui.bootstrap',
    'oui',
    'ngOvhResponsivePopover',
    partition,
    cucAutoComplete,
    cucSpaceMeter,
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($qProvider, coreConfigProvider, ovhDocUrlProvider) => {
      ovhDocUrlProvider.setUserLocale(coreConfigProvider.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .controller('NashaCtrl', NashaCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'nasha/information/nasha-information.html',
        informationTemplate,
      );
      $templateCache.put(
        'nasha/information/nasha-information-usage-help.html',
        usageHelpTemplate,
      );
    },
  );

export default moduleName;
