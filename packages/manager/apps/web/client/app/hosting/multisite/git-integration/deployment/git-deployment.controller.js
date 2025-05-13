import { TRACKING_MULTISITE_PREFIX } from '../git-integration.constants';

export default class HostingMultisiteGitDeploymentController {
  /* @ngInject */
  constructor(
    HostingMultisiteGitDeploymentService,
    HostingDomain,
    coreURLBuilder,
    $translate,
    atInternet,
  ) {
    this.HostingMultisiteGitDeploymentService = HostingMultisiteGitDeploymentService;
    this.HostingDomain = HostingDomain;
    this.coreURLBuilder = coreURLBuilder;
    this.$translate = $translate;
    this.atInternet = atInternet;
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
    this.atInternet.trackClick({
      name: `${TRACKING_MULTISITE_PREFIX}::git-deployment::confirm`,
      type: 'action',
    });
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
