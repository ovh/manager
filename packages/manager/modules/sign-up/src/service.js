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

  saveNic(nicInfos) {
    return this.$http
      .put('/me', nicInfos);
  }
}
