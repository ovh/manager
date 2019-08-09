import _ from 'lodash';

export default class DedicatedCloudCertificationActivationSMSActivation {
  /* @ngInject */
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    this.usersWhoCanReceiveSMS = _
      .filter(
        this.usersWhoCanReceiveSMS,
        { isTokenValidator: true },
      )
      .map(user => ({
        userName: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.email,
        phoneNumber: user.phoneNumber,
      }));
  }

  mapUsersWhoCanReceiveSMS() {
    return this.$q.when({
      data: this.usersWhoCanReceiveSMS,
      meta: {
        totalCount: this.usersWhoCanReceiveSMS.length,
      },
    });
  }
}
