export default class userIdentitiesController {
  /* @ngInject */
  constructor(IAMService) {
    this.IAMService = IAMService;
  }

  $onChanges() {
    this.getIdentitiesUsers().then((data) => {
      this.users = data;
    });
  }

  getIdentitiesUsers() {
    return Promise.all(
      this.identities.map((identity) => this.getIdentityUser(identity)),
    );
  }

  async getIdentityUser(identity) {
    try {
      const user = await this.IAMService.getUser(identity.id);

      return user;
    } catch (error) {
      const { message } = error.data ?? {};

      return { ...identity, message };
    }
  }
}
