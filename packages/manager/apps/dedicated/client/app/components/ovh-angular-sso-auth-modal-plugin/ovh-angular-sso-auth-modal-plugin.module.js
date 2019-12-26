angular.module('App').config((ssoAuthModalPluginFctProvider) => {
  ssoAuthModalPluginFctProvider.setTranslationsPath(
    'node_modules/ovh-angular-sso-auth-modal-plugin/dist/modal',
  );
});
