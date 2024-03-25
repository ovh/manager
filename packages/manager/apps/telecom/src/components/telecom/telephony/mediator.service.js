export default /* @ngInject */ function TelephonyMediator(
  $q,
  $http,
  iceberg,
  OvhApiTelephony,
  TelephonyGroup,
  TelephonyGroupFax,
  TelephonyGroupLine,
  TelephonyGroupNumber,
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

  const createGroup = (group) => {
    return new TelephonyGroup(group);
  };

  const createService = (service) => {
    if (['fax', 'voicefax'].includes(service.featureType)) {
      return new TelephonyGroupFax(service);
    }
    if (service.serviceType === 'line') {
      return new TelephonyGroupLine(service);
    }
    if (service.serviceType === 'alias') {
      return new TelephonyGroupNumber(service);
    }
    return null;
  };

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
  self.findService = function findService(axiom) {
    return $http
      .get(`/telephony/searchServices?axiom=${axiom}`)
      .then(({ data: [result] }) => {
        if (result) {
          const { billingAccount, domain } = result;
          return $http
            .get(`/telephony/${billingAccount}/service/${domain}`)
            .then(({ data: service }) =>
              createService({ ...service, billingAccount }),
            );
        }
        return null;
      })
      .catch(() => null);
  };

  self.getAll = function getAll() {
    return iceberg(`/telephony`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: groups }) => groups.map(createGroup));
  };

  /* ----------  ACTIONS  ----------*/

  self.getGroup = function getGroup(billingAccount) {
    return $q
      .all({
        group: $http.get(`/telephony/${billingAccount}`),
        services: iceberg(`/telephony/${billingAccount}/service`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute(null, true).$promise,
      })
      .then(({ group: { data: group }, services: { data: services } }) => {
        const telephonyGroup = createGroup(group);
        services
          .map((service) => createService({ ...service, billingAccount }))
          .forEach((service) => {
            if (service instanceof TelephonyGroupFax)
              telephonyGroup.fax.push(service);
            if (service instanceof TelephonyGroupLine)
              telephonyGroup.lines.push(service);
            if (service instanceof TelephonyGroupNumber)
              telephonyGroup.numbers.push(service);
          });
        return telephonyGroup;
      });
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
