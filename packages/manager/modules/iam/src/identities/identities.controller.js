import { decodeUrn, encodeUrn } from '../resolves';
import { URN_VERSION, ENTITY } from '../iam.constants';

export default class IdentitiesController {
  /* @ngInject */
  constructor($q, $translate, IdentityService, PolicyService, coreConfig) {
    this.$q = $q;
    this.$translate = $translate;
    this.IdentityService = IdentityService;
    this.PolicyService = PolicyService;
    this.region = coreConfig.getRegion();
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.loading = true;

    this.identities = this.policy.identities
      .map(decodeUrn)
      .map((urn) => ({ title: urn.componentsString, urn }));

    this.$q
      .all({
        users: this.IdentityService.getUsers(),
        groups: this.IdentityService.getGroups(),
      })
      .then(({ users, groups }) => {
        this.userList = [
          ...users.map((user) => ({ accountType: 'user', userName: user })),
          ...groups.map((group) => ({
            accountType: 'group',
            userName: group,
          })),
        ];
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
    return this.goTo({
      name: 'iam.identities.delete',
      params: { identity },
    });
  }

  onUsersFieldKeypress(event) {
    if (event.key !== 'Enter') {
      this.suggestion = null;
    }
  }

  get newUserIdentityUrn() {
    const { newUser, region, suggestion, user } = this;
    return encodeUrn({
      version: URN_VERSION,
      region: region.toUpperCase(),
      entity: ENTITY.IDENTITY,
      components: suggestion
        ? [suggestion.accountType, `${user.nichandle}/${suggestion.userName}`]
        : ['account', newUser],
    });
  }

  editIdentitites() {
    return this.PolicyService.editIdentities(this.policy.id, [
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
        });
      });
  }

  submit() {
    this.goBack({
      success: this.$translate.instant(
        'iam_identities_submit_identity_success',
      ),
      reload: true,
    });
  }
}
