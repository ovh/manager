import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import { AUDIO_FORMAT } from './freefax-voicemailConfiguration.constants';
import template from './freefax-voicemailConfiguration.html';
import controller from './freefax-voicemailConfiguration.controller';

const moduleName = 'managerFreefaxVoicemailConfiguration';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'telecomUniverseComponents',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('freefax.voicemail-configuration', {
      url: '/voicemail',
      template,
      controller,
      controllerAs: 'VoicemailConf',
      translations: ['.'],
    });
  })
  .constant('FREEFAX_AUDIO_FORMAT', AUDIO_FORMAT);

export default moduleName;
