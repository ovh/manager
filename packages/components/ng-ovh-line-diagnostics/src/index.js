import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './component';
import factory from './factory';
import provider from './provider';

import detectionStepTemplate from './steps/detection-step.html';
import investigationStepTemplate from './steps/investigation-step.html';
import solutionProposalStepTemplate from './steps/solution-proposal-step.html';

import './index.less';

const moduleName = 'ngOvhLineDiagnostics';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngOvhTelecomUniverseComponents',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('lineDiagnostics', component)
  .factory('LineDiagnosticFactory', factory)
  .provider('LineDiagnostics', provider)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        '/ng-ovh-line-diagnostics/steps/detection-step.html',
        detectionStepTemplate,
      );
      $templateCache.put(
        '/ng-ovh-line-diagnostics/steps/investigation-step.html',
        investigationStepTemplate,
      );
      $templateCache.put(
        '/ng-ovh-line-diagnostics/steps/solution-proposal-step.html',
        solutionProposalStepTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
