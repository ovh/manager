import filter from 'lodash/filter';
import has from 'lodash/has';
import map from 'lodash/map';

/**
 *  @ngdoc service
 *  @name managerApp.service:tucVoipBillingAccount
 *
 *  @requires OvhApiTelephony from ovh-api-services
 *  @requires managerApp.object:TucVoipBillingAccount
 *
 *  @description
 *  Service that manage API calls to `/telephony/{billingAccount}`.
 */
export default class {
  /* @ngInject */
  constructor(OvhApiTelephony, TucVoipBillingAccount) {
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucVoipBillingAccount = TucVoipBillingAccount;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucVoipBillingAccount#fetchAll
   *  @methodOf managerApp.service:tucVoipBillingAccount
   *
   *  @description
   *  Get all billingAccounts of connected user using API v7.
   *
   *  @param {Boolean} [withError=true]   Either return billingAccounts and services
   *                                      with error or not. Should be replaced with better filters
   *                                      when APIv7 will be able to filter by status code (SOON!!).
   *
   *  @return {Promise} That return an Array of TucVoipBillingAccount instances.
   */
  fetchAll(withError = true) {
    return this.OvhApiTelephony.v7()
      .query()
      .expand()
      .execute()
      .$promise.then((result) =>
        map(
          filter(
            result,
            (res) => has(res, 'value') || (withError && has(res, 'error')),
          ),
          (res) => {
            if (res.value && res.value.billingAccount) {
              return new this.TucVoipBillingAccount(res.value);
            }
            return new this.TucVoipBillingAccount({
              billingAccount: res.key,
              error: res.error,
            });
          },
        ),
      );
  }
}
