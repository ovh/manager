import angular from 'angular';

import controller from './controller';
import template from './template.html';

/**
 * @ngdoc service
 * @name ng-ovh-sso-auth-modal-plugin.ssoAuthModalPluginFct
 * @module ng-ovh-sso-auth-modal-plugin
 * @description
 * Handle switch session, opens the modal
 */
export default function ssoAuthModalPluginFct() {
  let translationPath =
    '../bower_components/ovh-angular-sso-auth-modal-plugin/dist/modal';
  let deferredObj;

  /**
   * @ngdoc function
   * @name setTranslationsPath
   * @methodOf ng-ovh-sso-auth-modal-plugin.ssoAuthModalPluginFct
   * @description
   * Set translation path
   *
   * @param {string} _translationPath translation path
   */
  this.setTranslationsPath = function setTranslationsPath(_translationPath) {
    translationPath = _translationPath;
  };

  this.$get = /* @ngInject */ function $get($injector) {
    return {
      handleSwitchSession(ssoAuthentication) {
        if (!deferredObj) {
          const $q = $injector.get('$q');
          const $uibModal = $injector.has('$uibModal')
            ? $injector.get('$uibModal')
            : $injector.get('$modal');

          deferredObj = $q.defer();

          const currentUserId = ssoAuthentication.getUserIdCookie();

          const modalDatas = {
            userId: ssoAuthentication.userId,
            user: ssoAuthentication.user,
            userConfig: {
              url: ssoAuthentication.getUserUrl(),
              method: 'GET',
              headers: ssoAuthentication.getHeaders(),
            },
            logoutUrl: ssoAuthentication.getLogoutUrl(),
            translationPath,
          };

          if (ssoAuthentication.userId && !currentUserId) {
            // from connected to disconnected
            modalDatas.mode = 'CONNECTED_TO_DISCONNECTED';
          } else if (!ssoAuthentication.userId && currentUserId) {
            // from disconnected to connected
            modalDatas.mode = 'DISCONNECTED_TO_CONNECTED';
          } else if (ssoAuthentication.userId !== currentUserId) {
            // from connected to connected with other
            modalDatas.mode = 'CONNECTED_TO_OTHER';
          }

          $uibModal.open({
            template,
            controller,
            controllerAs: 'ssoAuthModalCtrl',
            resolve: {
              params() {
                return angular.copy(modalDatas);
              },
            },
            size:
              modalDatas.mode === 'DISCONNECTED_TO_CONNECTED' ||
              modalDatas.mode === 'CONNECTED_TO_OTHER'
                ? 'lg'
                : undefined,
            keyboard: false,
            backdrop: 'static',
            windowClass: 'sso-modal',
          });
        }
        return deferredObj.promise;
      },
    };
  };
}
