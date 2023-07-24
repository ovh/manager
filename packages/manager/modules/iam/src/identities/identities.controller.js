import { URN_VERSION, ENTITY, TAG } from '../iam.constants';
import { decodeUrn, encodeUrn } from '../iam.paramTypes';

export default class IdentitiesController {
  /* @ngInject */
  constructor($http, $q, $translate, IAMService, coreConfig) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.IAMService = IAMService;
    this.account = '';
    this.region = coreConfig.getRegion();
  }

  $onInit() {
    const decodedIdentities = this.policy.identities.map(decodeUrn);

    this.loading = true;

    this.identities = decodedIdentities.map((urn) => ({
      title: urn.componentsString,
      urn,
    }));

    this.$q
      .all({
        groups: this.IAMService.getIdentityGroups(),
        users: this.IAMService.getIdentityUsers(),
        account: this.$http
          .get('/auth/details')
          .then(({ data: { account } }) => account),
      })
      .then(({ users, groups, account }) => {
        this.account = account;
        this.userList = [
          ...users.map((user) => ({ accountType: 'user', userName: user })),
          ...groups.map((group) => ({
            accountType: 'group',
            userName: group,
          })),
        ].filter(
          ({ accountType, userName }) =>
            !decodedIdentities.find(
              ({ components: [identityAccountType, identityUserName] }) =>
                identityAccountType === accountType &&
                identityUserName === `${account}/${userName}`,
            ),
        );
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        this.alert.error('iam_identities_error_load_users', { message });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  goToDeleteIdentity(identity) {
    this.trackClick(TAG.IDENTITIES__REMOVE_USER);
    return this.goTo({
      name: 'iam.identities.delete',
      params: { identity },
    });
  }

  onBackButtonClick() {
    this.trackClick(TAG.IDENTITIES__CANCEL);
    return this.goBack();
  }

  onUsersFieldKeypress(event) {
    if (event.key !== 'Enter') {
      this.suggestion = null;
    }
  }

  get newUserIdentityUrn() {
    const { newUser, region, suggestion, account } = this;
    return encodeUrn({
      version: URN_VERSION,
      region: region.toUpperCase(),
      entity: ENTITY.IDENTITY,
      components: suggestion
        ? [suggestion.accountType, `${account}/${suggestion.userName}`]
        : ['account', newUser],
    });
  }

  editIdentitites() {
    this.trackClick(TAG.IDENTITIES__ADD);
    return this.IAMService.setPolicyIdentities(this.policy.id, [
      ...this.policy.identities,
      this.newUserIdentityUrn,
    ])
      .then(() => {
        return this.goTo({
          name: '.',
          params: { policy: this.policy.id },
          success: this.$translate.instant(
            'iam_identities_add_identity_success',
          ),
          reload: true,
          tag: TAG.POLICIES__IDENTITIES_CONFIRM_BANNER__SUCCESS,
        });
      })
      .catch((e) => {
        return this.goTo({
          name: '.',
          params: { policy: this.policy.id },
          error: this.$translate.instant('iam_identities_add_identity_error', {
            message: e?.data?.message,
          }),
          reload: true,
          tag: TAG.POLICIES__IDENTITIES_CONFIRM_BANNER__ERROR,
        });
      });
  }

  /**
   * Called back when a guide menu item is clicked
   * @param {string} guideKey
   */
  onGuideClick(guideKey) {
    this.trackClick(TAG.GUIDE(guideKey));
  }
}
