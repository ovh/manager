export default class HostingMultisiteGitViewLastDeploymentController {
  /* @ngInject */
  constructor(HostingMultisiteGitViewLastDeploymentService) {
    this.HostingMultisiteGitViewLastDeploymentService = HostingMultisiteGitViewLastDeploymentService;
  }

  $onInit() {
    this.isLoading = true;
    this.HostingMultisiteGitViewLastDeploymentService.getWebsitesDeployments(
      this.serviceName,
      this.websiteId,
    )
      .then(([deploymentId]) => {
        return this.HostingMultisiteGitViewLastDeploymentService.getWebsitesDeploymentLogs(
          this.serviceName,
          this.websiteId,
          deploymentId,
        );
      })
      .then((logs) => {
        this.logs = logs;
      })
      .catch(({ data: { message } }) => {
        this.errorMessage = message;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
