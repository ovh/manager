/**
 * @ngdoc controller
 * @name ng-ovh-sso-auth-modal-plugin.SsoAuthModalController
 * @module ng-ovh-sso-auth-modal-plugin
 * @description
 * Controller of the modal
 */
export default /* @ngInject */ function SsoAuthModalController(
  $q,
  $window,
  $translate,
  params,
) {
  const self = this;

  self.loaders = {
    trads: true,
    init: true,
    action: false,
  };

  self.data = params;

  // mode === CONNECTED_TO_DISCONNECTED = from connected to disconnected
  // mode === DISCONNECTED_TO_CONNECTED = from disconnected to connected
  // mode === CONNECTED_TO_OTHER = from connected to connected with other

  self.reload = function reload() {
    self.loaders.action = true;
    if (angular.isFunction(self.data.onReloadCallback)) {
      self.data.onReloadCallback();
    } else {
      $window.location.replace(
        $window.location.href.replace($window.location.hash, ''),
      );
    }
  };

  self.logout = function logout() {
    self.loaders.action = true;
    if (angular.isFunction(self.data.onLogoutCallback)) {
      self.data.onLogoutCallback();
    } else {
      $window.location.replace(self.data.logoutUrl);
    }
  };

  function getUser() {
    const deferredObj = $q.defer();

    fetch(self.data.userConfig.url, {
      headers: self.data.userConfig.headers,
      credentials: 'same-origin',
    })
      .then((data) => {
        deferredObj.resolve(data.json());
      })
      .catch((err) => {
        deferredObj.resolve(err);
      });

    return deferredObj.promise;
  }

  function init() {
    return $translate
      .refresh()
      .then(() => {
        self.loaders.trads = false;
        if (
          self.data.mode === 'DISCONNECTED_TO_CONNECTED' ||
          self.data.mode === 'CONNECTED_TO_OTHER'
        ) {
          return getUser().then(
            (user) => {
              self.data.currentUser = user;
            },
            () => {
              self.reload();
            },
          );
        }
        return null;
      })
      .finally(() => {
        self.loaders.init = false;
      });
  }

  init();
}
