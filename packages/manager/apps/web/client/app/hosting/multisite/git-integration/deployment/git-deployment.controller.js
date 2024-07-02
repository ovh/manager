export default class HostingMultisiteGitDeploymentController {
  /* @ngInject */
  constructor(
    HostingMultisiteGitDeploymentService,
    HostingDomain,
    coreURLBuilder,
    $translate,
  ) {
    this.HostingMultisiteGitDeploymentService = HostingMultisiteGitDeploymentService;
    this.HostingDomain = HostingDomain;
    this.coreURLBuilder = coreURLBuilder;
    this.$translate = $translate;
    this.gitForcePush = false;
  }

  $onInit() {
    this.isLoading = true;
    this.HostingDomain.getWebsitesAssociated(this.serviceName, this.path)
      .then((websiteIds) => {
        [this.websiteId] = websiteIds;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  deployment() {
    this.isDeploying = true;
    this.HostingMultisiteGitDeploymentService.postWebsiteDeploy(
      this.serviceName,
      this.websiteId,
      this.gitForcePush,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_deployment_message_success',
          ),
          'info',
          true,
        ),
      )
      .catch(() =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_deployment_message_error',
          ),
          'warning',
        ),
      );
  }
}
