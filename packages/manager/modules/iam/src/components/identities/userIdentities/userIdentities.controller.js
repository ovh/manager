export default class userIdentitiesController {
  /* @ngInject */
  constructor(IAMService, $q, $translate) {
    this.IAMService = IAMService;
    this.$q = $q;
    this.$translate = $translate;

    this.isSelectingUsers = false;
  }

  $onChanges() {
    this.getIdentitiesUsers().then((data) => {
      this.users = data;
    });
  }

  getIdentitiesUsers() {
    return this.$q.all(
      this.identities.map((identity) => this.getIdentityUser(identity)),
    );
  }

  getIdentityUser(identity) {
    return this.IAMService.getUser(identity.id).catch((error) => {
      const { message } = error.data ?? {};
      return { ...identity, message };
    });
  }

  openSelectUsersModal() {
    this.isSelectingUsers = true;
  }

  closeSelectUsersModal() {
    this.isSelectingUsers = false;
  }

  getUserList() {
    return this.IAMService.getUserList()
      .then((result) => ({
        data: result,
      }))
      .catch((error) => {
        const { message } = error.data ?? {};
        const errorMessage = this.$translate.instant(
          'iam_identities_users_load_error',
          {
            message,
          },
        );
        return { errorMessage };
      });
  }

  static userSearchFilter(option, query) {
    const { login, email } = option;
    return query.length > 0
      ? email.toLowerCase().includes(query.toLowerCase()) ||
          login.toLowerCase().includes(query.toLowerCase())
      : true;
  }

  onAddUsers(selectedOptions) {
    const urns = selectedOptions.map((o) => o.urn);
    this.onAddIdentities({ urns });
    this.closeSelectUsersModal();
  }

  onRemoveUser(urn) {
    this.onRemoveIdentity({ urn });
  }
}
