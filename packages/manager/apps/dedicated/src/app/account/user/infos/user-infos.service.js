import get from 'lodash/get';
import keys from 'lodash/keys';
import set from 'lodash/set';

angular.module('UserAccount').service('UserAccount.services.Infos', [
  '$http',
  '$q',
  'UserAccount.constants',
  '$window',
  function ($http, $q, constants, $window) {
    const swsUseraccountInfosPath = `${constants.swsProxyRootPath}me`;
    const cache = {
      me: 'UNIVERS_USER_ME',
    };

    this.getUseraccountInfos = function () {
      return $http.get(swsUseraccountInfosPath).then((response) => {
        const { data } = response;
        if (response.status < 300) {
          if (data.phone && data.phone.indexOf('.') > -1) {
            data.phone = data.phone.replace(/\./g, '');
          }
          return data;
        }
        return $q.reject(response);
      });
    };

    this.updateUseraccountInfos = function (data) {
      return $http.put(swsUseraccountInfosPath, data).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.changePassword = function () {
      return $http.post([swsUseraccountInfosPath, 'changePassword'].join('/')).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.changeEmail = function (email) {
      return $http.post([swsUseraccountInfosPath, 'changeEmail'].join('/'), { newEmail: email }).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.fetchConsentDecision = function (campaignName) {
      return $http.get([swsUseraccountInfosPath, 'consent', campaignName, 'decision'].join('/')).then((response) => {
        if (response.status < 300) {
          return response.data;
        }

        return $q.reject(response);
      });
    };

    this.updateConsentDecision = function (campaignName, value) {
      return $http.put([swsUseraccountInfosPath, 'consent', campaignName, 'decision'].join('/'), { value }).then((response) => {
        if (response.status < 300) {
          return response.data;
        }

        return $q.reject(response);
      });
    };

    this.taskEmailChanges = function (state) {
      let options;
      if (state) {
        options = {
          params: {
            state,
          },
        };
      }
      return $http.get([swsUseraccountInfosPath, 'task', 'emailChange'].join('/'), options).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.taskEmailChange = function (id) {
      return $http.get([swsUseraccountInfosPath, 'task', 'emailChange', $window.encodeURIComponent(id)].join('/')).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.taskEmailChangeAccept = function (id, token) {
      return $http.post([swsUseraccountInfosPath, 'task', 'emailChange', $window.encodeURIComponent(id), 'accept'].join('/'), { token }).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.taskEmailChangeRefuse = function (id, token) {
      return $http.post([swsUseraccountInfosPath, 'task', 'emailChange', $window.encodeURIComponent(id), 'refuse'].join('/'), { token }).then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.getListOfRulesFieldName = function () {
      return $http.get(`${constants.swsProxyRootPath}newAccount.json`).then((response) => {
        let result = [];
        const models = get(response, 'data.models');

        if (models) {
          const rules = models['nichandle.CreationRules'];
          if (rules) {
            result = keys(rules.properties);
          }
        }

        return result;
      });
    };

    this.getCreationRules = function (params) {
      // Get creation Rules by user
      return $http
        .get([constants.swsProxyRootPath, 'newAccount/creationRules'].join(''), {
          params,
        })
        .then(
          (response) => {
            const creationRules = {};

            angular.forEach(response.data, (v, k) => {
              creationRules[k] = {
                mandatory: v.mandatory,
                regularExpression: v.regularExpression ? new RegExp(v.regularExpression) : new RegExp('.*'),
                example: v.regularExpression ? new RandExp(new RegExp(v.regularExpression)).gen() : '',
              };
            });

            return creationRules;
          },
          () => ({}),
        )
        .then(returnResponse => $http
          .get([constants.swsProxyRootPath, 'newAccount/corporationType'].join(''), {
            params: {
              country: params.country,
            },
          })
          .then(
            (response) => {
              set(returnResponse, 'availableCorporationType', response.data);
              return returnResponse;
            },
            () => {
              set(returnResponse, 'availableCorporationType', null);
              return returnResponse;
            },
          ))
        .then(returnResponse => $http
          .get([constants.swsProxyRootPath, 'newAccount/legalform'].join(''), {
            params: {
              country: params.country,
            },
          })
          .then(
            (response) => {
              set(returnResponse, 'availableLegalform', response.data);
              return returnResponse;
            },
            () => {
              set(returnResponse, 'availableLegalform', null);
              return returnResponse;
            },
          ))
        .then(returnResponse => $http
          .get([constants.swsProxyRootPath, 'newAccount/area'].join(''), {
            params: {
              country: params.country,
            },
          })
          .then(
            (response) => {
              set(returnResponse, 'availableArea', response.data);
              return returnResponse;
            },
            () => {
              set(returnResponse, 'availableArea', null);
              return returnResponse;
            },
          ))
        .then(returnResponse => $http.get([constants.swsProxyRootPath, 'newAccount.json'].join('')).then(
          (response) => {
            set(returnResponse, 'availableGender', response.data.models['nichandle.GenderEnum'].enum);
            return returnResponse;
          },
          () => {
            set(returnResponse, 'availableGender', []);
            return returnResponse;
          },
        ));
    };

    this.getMeModels = function () {
      return $http.get([constants.swsProxyRootPath, 'me.json'].join(''), { cache: cache.me }).then(response => response.data.models);
    };

    this.getDeveloperMode = function () {
      return $http.get(`${swsUseraccountInfosPath}/accessRestriction/developerMode`).then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return $q.reject(response);
      });
    };

    this.updateDeveloperMode = function (developmentMode) {
      return $http.put(`${swsUseraccountInfosPath}/accessRestriction/developerMode`, developmentMode).then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return $q.reject(response);
      });
    };
  },
]);
