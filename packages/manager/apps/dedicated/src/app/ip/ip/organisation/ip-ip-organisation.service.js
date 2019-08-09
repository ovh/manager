angular.module('Module.ip.services').service('IpOrganisation', [
  '$http',
  '$q',
  '$rootScope',
  'constants',
  'OvhHttp',
  'Poll',
  function ($http, $q, $rootScope, constants, OvhHttp, Poll) {
    const self = this;
    const swsProxypassPath = 'apiv6';

    this.getIpOrganisation = function () {
      return $http.get([swsProxypassPath, 'me/ipOrganisation'].join('/')).then(
        (data) => {
          const queue = [];
          const organisations = [];
          angular.forEach(data.data, (orgId) => {
            queue.push(
              self.getIpOrganisationDetails(orgId).then((data2) => {
                organisations.push(data2);
              }),
            );
          });
          return $q.all(queue).then(() => organisations, http => $q.reject(http.data));
        },
        http => $q.reject(http.data),
      );
    };

    this.getIpOrganisationDetails = function (orgId) {
      return $http.get([swsProxypassPath, 'me/ipOrganisation', orgId].join('/')).then(data => data.data);
    };

    this.getAccountRegexp = function (country, ovhSubsidiary) {
      return $http
        .get([swsProxypassPath, 'newAccount/creationRules'].join('/'), {
          params: {
            country,
            legalform: 'individual',
            ovhCompany: 'ovh',
            ovhSubsidiary,
          },
        })
        .then(data => data.data, http => $q.reject(http.data));
    };

    this.postOrganisation = function (params) {
      return $http.post([swsProxypassPath, 'me/ipOrganisation'].join('/'), params).then(
        (data) => {
          $rootScope.$broadcast('ips.organisation.display');
          return data.data;
        },
        http => $q.reject(http.data),
      );
    };

    this.putOrganisation = function (params) {
      // sale
      const paramsToSend = angular.copy(params);
      delete paramsToSend.organisationId;
      return $http.put([swsProxypassPath, `me/ipOrganisation/${params.organisationId}`].join('/'), params).then(
        (data) => {
          $rootScope.$broadcast('ips.organisation.display');
          return data.data;
        },
        http => $q.reject(http.data),
      );
    };

    this.changeOrganisation = function (params) {
      return OvhHttp.post('/ip/{ip}/changeOrg', {
        rootPath: 'apiv6',
        urlParams: {
          ip: params.ipBlock,
        },
        data: {
          organisation: params.organisationId,
        },
      }).then((task) => {
        if (task) {
          self.poll({
            taskId: task.taskId,
            ipBlock: encodeURIComponent(params.ipBlock),
            namespace: 'organisation.change',
          });
        }

        return task;
      });
    };

    this.poll = function (opts) {
      return Poll.poll([swsProxypassPath, 'ip', encodeURIComponent(opts.ipBlock), 'task', opts.taskId].join('/'), null, {
        namespace: opts.namespace,
      }).then((resp) => {
        $rootScope.$broadcast(`${opts.namespace}.done`, resp);
        return resp;
      });
    };

    this.killAllPolling = function () {
      Poll.kill({ namespace: 'organisation.change' });
    };
  },
]);
