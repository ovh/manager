// dependencies.
import angular from 'angular';
import set from 'lodash/set';

// peerDependencies.
import '@ovh-ux/ng-ovh-sso-auth';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

// styles
import './index.less';

import provider from './provider';

// Define the angular module name as a string in order to export it safely.
const moduleName = 'ngOvhSsoAuthModalPlugin';

angular
  .module(moduleName, [
    'ngOvhSsoAuth',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.bootstrap',
  ])
  .config(($provide) => {
    $provide.decorator(
      'ssoAuthentication',
      ($delegate, ssoAuthModalPluginFct) => {
        set($delegate, 'handleSwitchSession', () =>
          ssoAuthModalPluginFct.handleSwitchSession($delegate),
        );
        return $delegate;
      },
    );
  })
  .provider('ssoAuthModalPluginFct', provider)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
