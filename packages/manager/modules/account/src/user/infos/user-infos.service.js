import set from 'lodash/set';
import config from '../../config/config';

export default class UserAccountInfosService {
  /* @ngInject */
  constructor($http, $q, $window) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.swsUseraccountInfosPath = `${config.swsProxyRootPath}me`;
    this.cache = {
      me: 'UNIVERS_USER_ME',
    };
  }

  getUseraccountInfos() {
    return this.$http.get(this.swsUseraccountInfosPath).then(({ data }) => {
      if (data.phone && data.phone.includes('.')) {
        set(data, 'phone', data.phone.replace(/\./g, ''));
      }
      return data;
    });
  }

  updateUseraccountInfos(data) {
    return this.$http
      .put(this.swsUseraccountInfosPath, data)
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  changePassword() {
    return this.$http
      .post([this.swsUseraccountInfosPath, 'changePassword'].join('/'))
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  changeEmail(email) {
    return this.$http
      .post([this.swsUseraccountInfosPath, 'changeEmail'].join('/'), {
        newEmail: email,
      })
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  fetchMarketingConsentDecision() {
    return this.$http.get('/me/marketing').then((response) => response.data);
  }

  updateSmsMarketingConsentDecision(value) {
    return this.$http.put('/me/marketing', {
      denyAll: false,
      sms: {
        events: value,
        newProductRecommendation: value,
        newsletter: value,
        offerAndDiscount: value,
      },
    });
  }

  fetchConsentDecision(campaignName) {
    return this.$http
      .get(
        [
          this.swsUseraccountInfosPath,
          'consent',
          campaignName,
          'decision',
        ].join('/'),
      )
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }

        return this.$q.reject(response);
      });
  }

  updateConsentDecision(campaignName, value) {
    return this.$http
      .put(
        [
          this.swsUseraccountInfosPath,
          'consent',
          campaignName,
          'decision',
        ].join('/'),
        { value },
      )
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }

        return this.$q.reject(response);
      });
  }

  taskEmailChanges(state) {
    let options;
    if (state) {
      options = {
        params: {
          state,
        },
      };
    }
    return this.$http
      .get(
        [this.swsUseraccountInfosPath, 'task', 'emailChange'].join('/'),
        options,
      )
      .then(({ data }) => data);
  }

  taskEmailChange(id) {
    return this.$http
      .get(
        [
          this.swsUseraccountInfosPath,
          'task',
          'emailChange',
          this.$window.encodeURIComponent(id),
        ].join('/'),
      )
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  taskEmailChangeAccept(id, token) {
    return this.$http
      .post(
        [
          this.swsUseraccountInfosPath,
          'task',
          'emailChange',
          this.$window.encodeURIComponent(id),
          'accept',
        ].join('/'),
        { token },
      )
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  taskEmailChangeRefuse(id, token) {
    return this.$http
      .post(
        [
          this.swsUseraccountInfosPath,
          'task',
          'emailChange',
          this.$window.encodeURIComponent(id),
          'refuse',
        ].join('/'),
        { token },
      )
      .then((response) => {
        if (response.status < 300) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  getListOfRulesFieldName() {
    return this.$http
      .get(`${config.swsProxyRootPath}newAccount.json`)
      .then(({ data }) => {
        const { models = {} } = data;
        return Object.keys(models['nichandle.CreationRules']?.properties) || [];
      });
  }

  postRules(params) {
    return this.$http
      .post(`${config.swsProxyRootPath}newAccount/rules`, params)
      .then(({ data }) => data);
  }

  getCreationRules(params) {
    // Get creation Rules by user
    return this.$http
      .get([config.swsProxyRootPath, 'newAccount/creationRules'].join(''), {
        params,
      })
      .then(
        (response) => {
          const creationRules = {};

          angular.forEach(response.data, (v, k) => {
            creationRules[k] = {
              mandatory: v.mandatory,
              regularExpression: v.regularExpression
                ? new RegExp(v.regularExpression)
                : new RegExp('.*'),
              example: v.regularExpression
                ? new RandExp(new RegExp(v.regularExpression)).gen()
                : '',
            };
          });

          return creationRules;
        },
        () => ({}),
      )
      .then((returnResponse) =>
        this.$http
          .get(
            [config.swsProxyRootPath, 'newAccount/corporationType'].join(''),
            {
              params: {
                country: params.country,
              },
            },
          )
          .then(
            (response) => {
              set(returnResponse, 'availableCorporationType', response.data);
              return returnResponse;
            },
            () => {
              set(returnResponse, 'availableCorporationType', null);
              return returnResponse;
            },
          ),
      )
      .then((returnResponse) =>
        this.$http
          .get([config.swsProxyRootPath, 'newAccount/legalform'].join(''), {
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
          ),
      )
      .then((returnResponse) =>
        this.$http
          .get([config.swsProxyRootPath, 'newAccount/area'].join(''), {
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
          ),
      )
      .then((returnResponse) =>
        this.$http
          .get([config.swsProxyRootPath, 'newAccount.json'].join(''))
          .then(
            (response) => {
              set(
                returnResponse,
                'availableGender',
                response.data.models['nichandle.GenderEnum'].enum,
              );
              return returnResponse;
            },
            () => {
              set(returnResponse, 'availableGender', []);
              return returnResponse;
            },
          ),
      );
  }

  getMeModels() {
    return this.$http
      .get([config.swsProxyRootPath, 'me.json'].join(''), {
        cache: this.cache.me,
      })
      .then((response) => response.data.models);
  }

  getDeveloperMode() {
    return this.$http
      .get(`${this.swsUseraccountInfosPath}/accessRestriction/developerMode`)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }

  updateDeveloperMode(developmentMode) {
    return this.$http
      .put(
        `${this.swsUseraccountInfosPath}/accessRestriction/developerMode`,
        developmentMode,
      )
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return this.$q.reject(response);
      });
  }
}
