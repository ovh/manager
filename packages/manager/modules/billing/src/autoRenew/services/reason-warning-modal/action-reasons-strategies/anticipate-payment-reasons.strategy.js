export default class {
  static getReasons(service, user) {
    const reasons = [];

    const userHasBillingRights =
      service.hasBillingRights(user.nichandle) ||
      service.hasBillingRights(user.auth.account);

    if (!userHasBillingRights) {
      reasons.push('billing_right');
    }

    return reasons;
  }
}
