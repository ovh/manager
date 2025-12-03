export default class {
  static getReasons(service, user) {
    const reasons = [];

    const hasAdminRights =
      service.hasAdminRights(user.nichandle) ||
      service.hasAdminRights(user.auth.account);

    if (!hasAdminRights) {
      reasons.push('admin_right');
    }

    return reasons;
  }
}
