import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

/**
 *  @ngdoc overview
 *  @name managerApp
 *  @description
 *  # OVH Control Panel Telecom UI
 *
 *  <p>Welcome in OVH Manager Telecom (the OVH Control Panel Telecom UI) documentation!</p>
 *  <p>This is the beginning of writing a documentation to help us
 *    to improve the OVH Telecom Control Panel.</p>
 *  <p>For the moment, only telephony (VoIP) section will be documented.
 *    It will show you how to use angular services to make the good calls to OVH API.</p>
 */

/**
 *  @ngdoc service
 *  @name managerApp.service:tucTelecomVoip
 *
 *  @requires managerApp.service:tucVoipBillingAccount
 *  @requires managerApp.service:tucVoipService
 *
 *  @description
 *  <p>This service is the beginning of everything :-)
 *    This service will allow you to fetch all billingAccounts
 *    and their services in one API call. It's used for example to display sidebar menu.</p>
 *  <p>This will be used to replace telecom/telephony factories
 *    and services like it has been done in a bad way :-)</p>
 */
export default class {
  /* @ngInject */
  constructor(tucVoipBillingAccount, tucVoipService, $http) {
    this.tucVoipBillingAccount = tucVoipBillingAccount;
    this.tucVoipService = tucVoipService;
    this.$http = $http;
  }

  /**
   *  @ngdoc method
   *  @name managerApp.service:tucTelecomVoip#fetchAll
   *  @methodOf managerApp.service:tucTelecomVoip
   *
   *  @description
   *  Fetch all (billing accounts and associated services) of connected user.
   *
   *  @param {Boolean} [withError=true]   Either return billingAccounts and services
   *                                      with error or not.
   *
   *  @return {Promise} That returns all services grouped by billing accounts.
   */
  fetchAll(withError = true) {
    return this.tucVoipBillingAccount
      .fetchAll(withError)
      .then((billingAccounts) =>
        this.tucVoipService.fetchAll(withError).then((services) => {
          const groupedServices = groupBy(services, (service) =>
            get(service, 'billingAccount'),
          );

          billingAccounts.forEach((billingAccount) =>
            billingAccount.addServices(
              get(groupedServices, billingAccount.billingAccount, []),
            ),
          );
          return billingAccounts;
        }),
      );
  }

  fetchSound(soundId) {
    return this.$http
      .get(`/telephony/sounds/${soundId}`)
      .then(({ data }) => data);
  }
}
