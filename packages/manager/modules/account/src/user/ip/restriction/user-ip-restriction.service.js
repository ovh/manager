export default /* @ngInject */ function UserAccountIpRestrictionsService(
  $http,
  $q,
) {
  function getSuccessDataOrReject(response) {
    return response.status < 300 ? response.data : $q.reject(response.data);
  }

  this.getList = function getList() {
    return $http
      .get('/me/accessRestriction/ip', {
        headers: {
          Pragma: 'no-cache',
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '5000',
        },
      })
      .then(getSuccessDataOrReject)
      .then((data) => {
        return data.map((ipRestriction) => ({
          ...ipRestriction,
          rule: ipRestriction.rule.toUpperCase(),
        }));
      });
  };

  this.updateRestriction = function updateRestriction(restriction) {
    return $http
      .put(
        ['/me/accessRestriction/ip', restriction.id].join('/'),
        {
          rule: restriction.rule.toLowerCase(),
          warning: restriction.warning,
        },
        {
          serviceType: 'apiv6',
        },
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.deleteRestriction = function deleteRestriction(restriction) {
    return $http
      .delete(['/me/accessRestriction/ip', restriction.id].join('/'), {
        serviceType: 'apiv6',
      })
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.addRestriction = function addRestriction(restriction) {
    return $http
      .post(
        '/me/accessRestriction/ip',
        {
          ip: restriction.ip,
          rule: restriction.rule.toLowerCase(),
          warning: restriction.warning,
        },
        {
          serviceType: 'apiv6',
        },
      )
      .then(
        (data) => data.data,
        (http) => $q.reject(http.data),
      );
  };

  this.getDefaultRule = function getDefaultRule() {
    return $http
      .get('/me/accessRestriction/ipDefaultRule', {
        serviceType: 'apiv6',
      })
      .then(getSuccessDataOrReject);
  };

  this.updateDefaultRule = function updateDefaultRule(opts) {
    return $http.put(
      '/me/accessRestriction/ipDefaultRule',
      {
        rule: opts.rule.toLowerCase(),
        warning: opts.warning,
      },
      {
        serviceType: 'apiv6',
      },
    );
  };
}
