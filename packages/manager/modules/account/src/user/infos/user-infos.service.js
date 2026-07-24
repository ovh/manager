import set from 'lodash/set';

export default class UserAccountInfosService {
  /* @ngInject */
  constructor($http, $q, $window) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.swsUseraccountInfosPath = '/me';
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
    return this.$http.get('/newAccount.json').then(({ data }) => {
      const { models = {} } = data;
      return Object.keys(models['nichandle.CreationRules']?.properties) || [];
    });
  }

  postRules(params) {
    return this.$http
      .post('/newAccount/rules', params)
      .then(({ data }) => data);
  }

  /**
   * Get the e-invoicing billing address rule for a given SIRET (PPF directory).
   *
   * Reuses the existing account rules endpoint (POST /newAccount/rules — the
   * apiv6 face of the Furry account-rules mechanism; the contract's Furry name is
   * /meta/account/rules), passing the 14-digit SIRET so the response carries the
   * `einvoicing_billing_address` entry driving the picker (RG1-RG4).
   */
  getEinvoicingRules({ siret, legalForm }) {
    return this.$http
      .post('/newAccount/rules', {
        country: 'FR',
        legalform: legalForm,
        companyNationalIdentificationNumber: siret,
        action: 'update',
      })
      .then(({ data }) => {
        // The endpoint returns the full rules array — pick the e-invoicing entry.
        // Tolerate both the field-name spelling (apiv6 may camelCase the value)
        // and the key convention (field_name vs fieldName).
        const isEinvoicing = (name) =>
          name === 'einvoicing_billing_address' ||
          name === 'einvoicingBillingAddress';
        const entry = (Array.isArray(data) ? data : []).find(
          (rule) =>
            isEinvoicing(rule.fieldName) || isEinvoicing(rule.field_name),
        );
        return {
          // The real /newAccount/rules omits `visible`: the entry's PRESENCE
          // means the field applies (in:[] empty / in:[x] single / in:[x,y] many)
          // — still honor an explicit visible:false if ever sent.
          visible: !!entry && entry.visible !== false,
          mandatory: Boolean(entry && entry.mandatory),
          in: (entry && ((entry.value && entry.value.in) || entry.in)) || null,
          defaultValue:
            (entry && (entry.default_value || entry.defaultValue)) || null,
        };
      });
  }

  getCreationRules(params) {
    // Get creation Rules by user
    return this.$http
      .get('/newAccount/creationRules', {
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
          .get('/newAccount/corporationType', {
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
          ),
      )
      .then((returnResponse) =>
        this.$http
          .get('/newAccount/legalform', {
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
          .get('/newAccount/area', {
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
        this.$http.get('/newAccount.json').then(
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
      .get('/me.json', {
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
