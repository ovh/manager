import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import { AUDIO_FORMAT } from './freefax-voicemailConfiguration.constants';
import template from './freefax-voicemailConfiguration.html';
import controller from './freefax-voicemailConfiguration.controller';

const moduleName = 'managerFreefaxVoicemailConfiguration';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('freefaxes.freefax.voicemail-configuration', {
        url: '/voicemail',
        template,
        controller,
        controllerAs: 'VoicemailConf',
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
    },
  )
  .constant('FREEFAX_AUDIO_FORMAT', AUDIO_FORMAT);

export default moduleName;
