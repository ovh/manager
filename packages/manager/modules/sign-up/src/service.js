import find from 'lodash/find';

export default class SignUpService {
  /* @ngInject */
  constructor($http) {
    // dependencies injections
    this.$http = $http;
  }

  /**
   *  Get the creation rules from API POST /newAccount/rules
   *  @param  {Object}  ruleParams The params needed for API call
   *  @return {Promise}            That returns an object containing creation rules
   */
  getCreationRules(ruleParams, timeout) {
    return this.$http
      .post('/newAccount/rules', ruleParams, {
        timeout: timeout.promise,
      })
      .then(({ data }) => data);
  }

  getCreationRulesParams() {
    return this.$http.get('/newAccount.json').then(({ data }) => {
      const api = find(data.apis, {
        path: '/newAccount/rules',
      });

      return find(api.operations, {
        httpMethod: 'POST',
      }).parameters;
    });
  }

  getNic() {
    return this.$http.get('/me').then(({ data }) => data);
  }

  saveNic(nicInfos) {
    return this.$http.put('/me', nicInfos);
  }

  sendSmsConsent(consent = false) {
    return this.$http.put('/me/marketing', {
      denyAll: consent !== true,
      sms: {
        events: consent,
        newProductRecommendation: consent,
        newsletter: consent,
        offerAndDiscount: consent,
      },
    });
  }
}
