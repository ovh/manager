export default class mfaEnrollmentCtrl {
  /* @ngInject */
  constructor(
    $state,
    CORE_MANAGER_URLS,
    coreConfig,
  ) {
    this.$state = $state;
    const mfaBaseUrl = _.get(CORE_MANAGER_URLS, `${coreConfig.getRegion()}.dedicated`);
    const mfaUrlPath = this.$state.href('app.account.user.security.mfa');
    this.mfaUrl = `${mfaBaseUrl}/${mfaUrlPath}`;
    this.mfaUrl = mfaUrlPath;
  }

  goBack() {
    this.$state.go(this.from ? this.from : this.rootState);
  }
}
