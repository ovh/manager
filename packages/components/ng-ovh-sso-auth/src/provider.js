import { NIC_STATE_ENUM } from './constants';

/**
 * @ngdoc service
 * @name ovh-angular-sso-auth.ssoAuthenticationProvider
 * @module ovh-angular-sso-auth
 * @description
 * Authentication for SSO
 *
 */
export default function() {
  let loginUrl = 'https://www.ovh.com/auth/';
  let logoutUrl = 'https://www.ovh.com/auth/?action=disconnect';
  let signUpUrl = 'https://www.ovh.com/auth/signup/new/';
  let userUrl = '/engine/api/me';
  let rules = [];
  const urlPrefix = '';
  let ovhSubsidiary = null;
  let allowIncompleteNic = false;

  /**
   * @ngdoc function
   * @name setLoginUrl
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set url login page
   *
   * @param {string} _loginUrl url
   */
  this.setLoginUrl = function setLoginUrl(_loginUrl) {
    loginUrl = _loginUrl;
  };

  /**
   * @ngdoc function
   * @name setLogoutUrl
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set logout url
   *
   * @param {string} _logoutUrl url
   */
  this.setLogoutUrl = function setLogoutUrl(_logoutUrl) {
    logoutUrl = _logoutUrl;
  };

  /**
   * @ngdoc function
   * @name setUserUrl
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set /me url
   *
   * @param {string} _userUrl url
   */
  this.setUserUrl = function setUserUrl(_userUrl) {
    userUrl = _userUrl;
  };

  /**
   * @ngdoc function
   * @name setConfig
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set configuration rules
   *
   * @param {bool} _rules Configuration rules
   */
  this.setConfig = function setConfig(_rules) {
    rules = _rules;
  };

  /**
   * @ngdoc function
   * @name setOvhSubsidiary
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set OVH subsidiary country code
   * When setted ovh.com/auth will use the new login/registration form based on the API
   *
   * @param {string} _ovhSubsidiary OVH subsidiary country code
   */
  this.setOvhSubsidiary = function setOvhSubsidiary(_ovhSubsidiary) {
    ovhSubsidiary = _ovhSubsidiary;
  };

  /**
   * @ngdoc function
   * @name allowIncompleteNic
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Configure if sso-auth allow or not incomplete nic.
   * At login phase, if nic is incomplete and not allowed, redirect to sign-up page.
   *
   * @param {boolean} _allowIncompleteNic true to allow incomplete nic to login, false otherwise.
   */
  this.allowIncompleteNic = function allowIncompleteNicFunc(
    _allowIncompleteNic,
  ) {
    allowIncompleteNic = _allowIncompleteNic;
  };

  /**
   * @ngdoc function
   * @name setSignUpUrl
   * @methodOf ovh-angular-sso-auth.ssoAuthenticationProvider
   *
   * @description
   * Set signUp url to redirect to in case of not allowed incomplete nic.
   *
   * @param {string} _signUpUrl The url to redirect to in case of not allowed incomplete nic.
   */
  this.setSignUpUrl = function setSignUpUrl(_signUpUrl) {
    signUpUrl = _signUpUrl;
  };

  // ---

  /**
     * @ngdoc service
     * @name ovh-angular-sso-auth.ssoAuthentication

     * @description
     * Authentication for SSO
     */
  const Authentication = function Authentication(
    $q,
    $timeout,
    $location,
    $window,
    $cookies,
  ) {
    let isLogged = false;
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      Accept: 'application/json',
    };

    const deferredObj = {
      login: $q.defer(),
      logout: undefined,
      loginPage: undefined,
    };

    this.userId = undefined; // from cookie "USERID"
    this.user = {}; // from API /me

    // ---

    /**
     * @ngdoc function
     * @name getLoginUrl
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get login page url
     */
    this.getLoginUrl = function getLoginUrl() {
      return loginUrl;
    };

    /**
     * @ngdoc function
     * @name getLogoutUrl
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get logout url
     */
    this.getLogoutUrl = function getLogoutUrl() {
      return logoutUrl;
    };

    /**
     * @ngdoc function
     * @name getUserUrl
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get user informations url (/me)
     */
    this.getUserUrl = function getUserUrl() {
      return userUrl;
    };

    /**
     * @ngdoc function
     * @name getUrlPrefix
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get url prefix for serviceType
     */
    this.getUrlPrefix = function getUrlPrefix(serviceType) {
      if (!rules || !Array.isArray(rules) || !rules.length) {
        return urlPrefix;
      }

      if (serviceType) {
        let i = 0;
        let rule = null;
        while (i < rules.length && rules[i].serviceType !== serviceType) {
          i += 1;
        }
        rule = rules[i];

        // eslint-disable-next-line no-prototype-builtins
        if (rule && rule.hasOwnProperty('urlPrefix')) {
          // Got it
          return rule.urlPrefix;
        }

        // serviceType unknown: return the default urlPrefix
        return urlPrefix;
      }

      // No serviceType: return the first rule urlPrefix
      return rules[0].urlPrefix;
    };

    // ---

    /**
     * @ngdoc function
     * @name isLogged
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get login status
     */
    this.isLogged = function isLoggedFunc() {
      return deferredObj.login.promise.then(() => isLogged);
    };

    /**
     * @ngdoc function
     * @name getRequestPromise
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get request promise
     */
    this.getRequestPromise = function getRequestPromise() {
      return this.isLogged().then((logged) => {
        if (!logged) {
          // user not logged in: cancel the request
          return $q.when(true);
        }

        // else, timeout the request after 1800 secs
        return $timeout(() => true, 1800000);
      });
    };

    // ---

    // /!\ For testing purpose only
    this.setIsLoggedIn = function setIsLoggedIn() {
      isLogged = true;
      deferredObj.login.resolve();
    };

    // ---

    /**
     * @ngdoc function
     * @name sessionCheckOrGoLogin
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Check session and logout if not logged
     */
    this.sessionCheckOrGoLogin = function sessionCheckOrGoLogin() {
      const self = this;
      return this.isLogged().then((logged) => {
        if (!logged) {
          return self.goToLoginPage();
        }
        return $q.when();
      });
    };

    // ---

    /**
     * @ngdoc function
     * @name getHeaders
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get headers
     */
    this.getHeaders = function getHeaders() {
      return headers;
    };

    /**
     * @ngdoc function
     * @name getUserIdCookie
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get USERID cookie
     */
    this.getUserIdCookie = function getUserIdCookie() {
      return typeof $cookies.get === 'function'
        ? $cookies.get('USERID')
        : $cookies.USERID;
    };

    /**
     * @ngdoc function
     * @name login
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Perform login (need to be done at the app init)
     */
    this.login = function login() {
      const self = this;

      // use jQuery ajax for checking if SESSION cookie setted
      $.ajax({
        url: self.getUserUrl(),
        method: 'GET',
        headers,
      })
        .done((data) => {
          self.user = data; // store user infos
          isLogged = true;

          if (data.state === NIC_STATE_ENUM.incomplete && !allowIncompleteNic) {
            self.goToSignUpPage();
          }
        })
        .fail(() => {
          isLogged = false;
        })
        .always(() => {
          self.userId = self.getUserIdCookie(); // store USERID
          deferredObj.login.resolve();
        });

      return deferredObj.login.promise;
    };

    /**
     * @ngdoc function
     * @name handleSwitchSession
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Handle the session modified
     */
    this.handleSwitchSession = function handleSwitchSession() {
      // By default, reload the page
      $window.location.reload();

      // Let requests in pending state (to prevent errors shown)
      return $q.defer().promise;
    };

    /**
     * @ngdoc function
     * @name getSsoAuthPendingPromise
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Get pending login promise
     */
    this.getSsoAuthPendingPromise = function getSsoAuthPendingPromise() {
      const self = this;

      return deferredObj.login.promise.then(() => {
        const currentUserId = self.getUserIdCookie();
        if (self.userId !== currentUserId) {
          return self.handleSwitchSession(currentUserId);
        }
        return $q.when();
      });
    };

    /**
     * @ngdoc function
     * @name logout
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Perform logout
     */
    this.logout = function logout(url) {
      if (!deferredObj.logout) {
        deferredObj.logout = $q.defer();
        isLogged = false;

        // redirect to logout page
        $timeout(() => {
          if (logoutUrl.indexOf('onsuccess') === -1) {
            logoutUrl += `${
              logoutUrl.indexOf('?') > -1 ? '&' : '?'
            }onsuccess=${encodeURIComponent(url || $location.absUrl())}`;
          }
          if (logoutUrl.indexOf('from') === -1 && document.referrer) {
            logoutUrl += `${
              logoutUrl.indexOf('?') > -1 ? '&' : '?'
            }from=${encodeURIComponent(document.referrer)}`;
          }
          $window.location.assign(logoutUrl);
        });
      }
      return deferredObj.logout.promise;
    };

    /**
     * @ngdoc function
     * @name goToLoginPage
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Redirect to login page
     */
    this.goToLoginPage = function goToLoginPage(url) {
      if (!deferredObj.loginPage) {
        deferredObj.loginPage = $q.defer();

        // redirect to login page
        $timeout(() => {
          const params = [];

          if (ovhSubsidiary) {
            params.push(`ovhSubsidiary=${ovhSubsidiary}`);
          }

          if (loginUrl.indexOf('onsuccess') === -1) {
            params.push(
              `onsuccess=${encodeURIComponent(url || $location.absUrl())}`,
            );
          }

          $window.location.assign(
            loginUrl +
              (loginUrl.indexOf('?') > -1 ? '&' : '?') +
              params.join('&'),
          );
        });
      }
      return deferredObj.loginPage.promise;
    };

    /**
     * @ngdoc function
     * @name goToSignUpPage
     * @methodOf ovh-angular-sso-auth.ssoAuthentication
     *
     * @description
     * Redirect to configured sign-up page
     */
    this.goToSignUpPage = function goToSignUpPage(url) {
      if (!deferredObj.signUpPage) {
        deferredObj.signUpPage = $q.defer();

        // redirect to login page
        $timeout(() => {
          const params = [];
          let destUrl = signUpUrl;
          const hasHashInSignUpUrl = destUrl.indexOf('#') > -1;
          let urlPart = destUrl;

          if (hasHashInSignUpUrl) {
            [, urlPart] = signUpUrl.split('#');
          } else {
            destUrl += '#/';
          }

          if (urlPart.indexOf('onsuccess') === -1) {
            params.push(
              `onsuccess=${encodeURIComponent(url || $location.absUrl())}`,
            );
          }

          if (urlPart.indexOf('lang') === -1) {
            const navigatorLg =
              window.navigator.language || window.navigator.userLanguage;
            if (navigatorLg) {
              params.push(`lang=${navigatorLg.split('-')[0]}`);
            }
          }

          $window.location.assign(
            destUrl +
              (urlPart.indexOf('?') > -1 ? '&' : '?') +
              params.join('&'),
          );
        });
      }
      return deferredObj.signUpPage.promise;
    };
  };

  this.$get = /* @ngInject */ function $get(
    $q,
    $timeout,
    $location,
    $window,
    $cookies,
  ) {
    return new Authentication($q, $timeout, $location, $window, $cookies);
  };
}
