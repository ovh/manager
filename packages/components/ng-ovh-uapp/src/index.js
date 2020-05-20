import angular from 'angular';
import '@ovh-ux/ng-ovh-sso-auth';
import { api } from '@ovh-ux/ovh-uapp';

const moduleName = 'ngOvhMicroApplication';

api.init();

angular.module(moduleName, ['ngOvhSsoAuth']).config(($provide) => {
  $provide.decorator('ssoAuthentication', ($delegate, $q) => {
    return {
      ...$delegate,
      handleSwitchSession: () => {
        api.sessionSwitch();
        return $q.defer().promise;
      },
      goToLoginPage: (url) => {
        api.login(url);
        return $q.defer().promise;
      },
      logout: () => {
        api.logout();
        return $q.defer().promise;
      },
    };
  });
});

export default moduleName;
