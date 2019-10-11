

export default class {
  /* @ngInject */
  constructor(
    $q,
  ) {
    this.$q = $q;
  }

  $onInit() {
    this.usersWhoCanReceiveSMS = _.map(
      _.filter(
        this.usersWhoCanReceiveSMS,
        { isTokenValidator: true },
      ),
      user => ({
        userName: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.email,
        phoneNumber: user.phoneNumber,
      }),
    );
  }

  mapUsersWhoCanReceiveSMS() {
    return this
      .$q
      .when({
        data: this.usersWhoCanReceiveSMS,
        meta: {
          totalCount: this.usersWhoCanReceiveSMS.length,
        },
      });
  }
}
