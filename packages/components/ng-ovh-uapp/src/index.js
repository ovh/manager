import angular from 'angular';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import uFrontend from '@ovh-ux/ovh-uapp';

const moduleName = 'ngOvhUApp';
const uappModule = angular.module(moduleName, [ngOvhSsoAuth]);

uappModule.config(($provide) => {
  $provide.decorator('ssoAuthentication', ($delegate, $q) => {
    $delegate.handleSwitchSession = () => { // eslint-disable-line
      uFrontend.sessionSwitch();
      return $q.defer().promise;
    };
    $delegate.goToLoginPage = (url) => { // eslint-disable-line
      uFrontend.login(url);
      return $q.defer().promise;
    };
    $delegate.logout = () => { // eslint-disable-line
      uFrontend.logout();
      return $q.defer().promise;
    };
    return $delegate;
  });
});

export default moduleName;
