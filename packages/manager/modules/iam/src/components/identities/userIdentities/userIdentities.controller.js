export default class userIdentityController {
  /* @ngInject */
  constructor(IAMService, $scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IAMService = IAMService;

    this.isSelectingUsers = false;
  }

  $onInit() {
    this.$scope.$watch('$ctrl.identities', async () => {
      this.users = await this.getIdentitiesUsers();
      this.$scope.$digest();
    });
  }

  getIdentitiesUsers = async () => {
    return Promise.all(
      this.identities.map((identity) => this.getIdentityUser(identity)),
    );
  };

  getIdentityUser = async (identity) => {
    try {
      const user = await this.IAMService.getUser(identity.id);

      return user;
    } catch (error) {
      const { message } = error.data ?? {};

      return { ...identity, message };
    }
  };

  // USER SELECT MODAL
  openSelectUsersModal = () => {
    this.isSelectingUsers = true;
  };

  closeSelectUsersModal = () => {
    this.isSelectingUsers = false;
  };

  getUserList = async () => {
    let data = [];
    let errorMessage = '';
    try {
      data = await this.IAMService.getUserList();
    } catch (error) {
      const { message } = error.data ?? {};
      errorMessage = this.$translate.instant(
        'iam_identities_error_load_users',
        {
          message,
        },
      );
    }
    return { data, errorMessage };
  };

  userSearchFilter = (option, query) => {
    const { login, email } = option;
    return email.includes(query) || login.includes(query);
  };

  addUsers = (selectedOptons) => {
    const urnList = selectedOptons.map((o) => o.urn);
    this.addIdentities(urnList);
    this.isSelectingUsers = false;
  };
}
