angular.module('managerApp').run(($transitions, ssoAuthentication) => {
  ssoAuthentication.login();

  // use of onStateChangeStart event to detect if state needs authentification
  // this is useful when application is first runned
  ssoAuthentication.isLogged().then((isLogged) => {
    $transitions.onStart({}, (transition) => {
      const toState = transition.to();

      const needToBeAuthenticate =
        toState.authenticate !== undefined ? toState.authenticate : true;

      if (needToBeAuthenticate && !isLogged) {
        ssoAuthentication.goToLoginPage();
      }
    });
  });
});
