import get from 'lodash/get';
import keys from 'lodash/keys';

export default /* @ngInject */ function TelephonyMediator(
  $q,
  $stateParams,
  OvhApiTelephony,
  TelephonyVoipService,
  REDIRECT_URLS,
  REDIRECT_V4_HASH,
) {
  const self = this;
  let currentGroup = null;

  /* @TODO
   * groups "cache" is only used by findService function
   * we should refactor this one to use the generic getAll method
   * to get rid of the useless cache.
   */
  self.groups = {};
  self.getAllDeferred = null;
  self.apiScheme = null;

  self.getApiScheme = function getApiScheme() {
    if (!self.apiScheme) {
      return OvhApiTelephony.v6()
        .schema()
        .$promise.then((scheme) => {
          self.apiScheme = scheme;
          return self.apiScheme;
        });
    }
    return $q.when(self.apiScheme);
  };

  /*= ===========================================
    =            V6 to V4 redirection            =
    ============================================ */

  self.getV6ToV4RedirectionUrl = function getV6ToV4RedirectionUrl(
    constantPath,
  ) {
    let url = REDIRECT_URLS.telephonyV4 + get(REDIRECT_V4_HASH, constantPath);

    if ($stateParams.serviceName) {
      url = url.replace('{lineNumber}', $stateParams.serviceName);
    }
    return url.replace('{billingAccount}', $stateParams.billingAccount);
  };

  /* -----  End of V6 to V4 redirection  ------*/

  /* ------ Awesome code from perl -----------*/
  self.IsValidNumber = function IsValidNumber(number) {
    return !!(
      number &&
      number.match(/^\+?(\d|\.| |#|-)+$/) &&
      number.length < 26 &&
      number.length > 2
    );
  };

  /*= =================================
    =            API MODELS            =
    ================================== */

  self.getApiModels = function getApiModels() {
    return OvhApiTelephony.v6()
      .schema()
      .$promise.then((schemas) => schemas.models);
  };

  self.getApiModelEnum = function getApiModelEnum(modelName) {
    return self.getApiModels().then((models) => models[modelName].enum);
  };

  /* -----  End of API MODELS  ------*/

  /*= ============================
    =            GROUP            =
    ============================= */

  /* ----------  SERVICES  ----------*/

  // @TODO refactor to use the getAll function instead of self.groups
  self.findService = function findService(serviceName) {
    let tmpGroup = null;
    let tmpService = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const billingAccount in self.groups) {
      if (get(self.groups, billingAccount)) {
        tmpGroup = get(self.groups, billingAccount);
        tmpService = tmpGroup.getService(serviceName);
        if (tmpService) {
          return tmpService;
        }
      }
    }
    return null;
  };

  self.getAll = function getAll(force) {
    if (self.getAllDeferred && !force) {
      return self.getAllDeferred.promise;
    }
    self.getAllDeferred = $q.defer();
    TelephonyVoipService.fetchAll()
      .then((groups) => {
        self.groups = groups; // only because of findService function
        self.getAllDeferred.resolve(groups);
      })
      .catch((err) => {
        self.getAllDeferred.reject(err);
      });
    return self.getAllDeferred.promise;
  };

  /* ----------  ACTIONS  ----------*/

  self.getGroup = function getGroup(billingAccount, force) {
    return self.getAll(force).then((groups) => groups[billingAccount]);
  };

  /*
   * @TODO refactor, this should be useless now, just call getAll
   * with force attribute to have fresh data.
   */
  self.resetAllCache = function resetAllCache() {
    self.getAllDeferred = null;
    self.groups = {};
  };

  /* ----------  CURRENT GROUP  ----------*/

  self.setCurrentGroup = function setCurrentGroup(group) {
    currentGroup = group;
    return currentGroup;
  };

  self.getCurrentGroup = function getCurrentGroup() {
    return currentGroup;
  };

  /* -----  End of GROUP  ------*/

  /*= ======================================
    =            SIDEBAR HELPERS            =
    ======================================= */

  /* ----------  COUNT  ----------*/

  self.getCount = function getCount(force) {
    return self.getAll(force).then((groups) => keys(groups).length);
  };

  /* -----  End of SIDEBAR HELPERS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.init = function init(force) {
    return self.getAll(force).then((groups) => {
      self.groups = groups; // only because of findService function
      return groups;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
