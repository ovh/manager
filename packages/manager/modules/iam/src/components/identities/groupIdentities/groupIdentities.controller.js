export default class userIdentityController {
  /* @ngInject */
  constructor(IAMService, $scope, $translate) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.IAMService = IAMService;

    this.isSelectingGroups = false;
  }

  $onInit() {
    this.$scope.$watch('$ctrl.identities', async () => {
      this.groups = await this.getIdentitiesGroups();
      this.$scope.$digest();
    });
  }

  getIdentitiesGroups = async () => {
    return Promise.all(
      this.identities.map((identity) => this.getIdentityGroup(identity)),
    );
  };

  getIdentityGroup = async (identity) => {
    try {
      const group = await this.IAMService.getGroup(identity.id);

      return group;
    } catch (error) {
      const { message } = error.data ?? {};

      return { ...identity, message };
    }
  };

  // GROUP SELECT MODAL
  getAccountGroups = async () => {
    let data = [];
    let errorMessage = '';
    try {
      data = await this.IAMService.getGroupList();
    } catch (error) {
      const { message } = error.data ?? {};
      errorMessage = this.$translate.instant(
        'iam_identities_error_load_groups',
        {
          message,
        },
      );
    }
    return { data, errorMessage };
  };

  groupSearchFilter = (option, query) => {
    const { name, role } = option;
    return name.includes(query) || role.includes(query);
  };

  openSelectGroupsModal = () => {
    this.isSelectingGroups = true;
  };

  addGroups = (selectedOptons) => {
    const urnList = selectedOptons.map((o) => o.urn);
    this.addIdentities(urnList);
    this.isSelectingGroups = false;
  };

  closeSelectGroupsModal = () => {
    this.isSelectingGroups = false;
  };
}
