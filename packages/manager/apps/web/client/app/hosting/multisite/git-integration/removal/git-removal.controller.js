import { TRACKING_MULTISITE_PREFIX } from '../git-integration.constants';

export default class HostingMultisiteGitDeploymentController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    HostingDomain,
    HostingMultisiteGitRemovalService,
  ) {
    this.isConfirmationStep = false;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.HostingMultisiteGitRemovalService = HostingMultisiteGitRemovalService;
    this.HostingDomain = HostingDomain;
  }

  setConfirmationStep() {
    this.isConfirmationStep = true;
  }

  setSuffixForMessage(modelValue) {
    this.deleteDirectory = modelValue ? '_delete_dir' : '';
  }

  primaryAction() {
    return this.isConfirmationStep
      ? this.deleteGitAssociation(!!this.deleteDirectory)
      : this.setConfirmationStep();
  }

  deleteGitAssociation(deleteFiles) {
    this.atInternet.trackClick({
      name: `${TRACKING_MULTISITE_PREFIX}::git-removal::confirm`,
      type: 'action',
    });
    this.isDeleting = true;
    this.HostingDomain.getWebsitesAssociated(this.serviceName, this.path)
      .then(([websiteId]) => {
        return this.HostingMultisiteGitRemovalService.deleteGitAssociation(
          this.serviceName,
          websiteId,
          deleteFiles,
        );
      })
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_delete_success_message',
          ),
          'success',
          true,
        ),
      )
      .catch(({ data: { message } }) =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_delete_error_message',
            { error: message },
          ),
          'danger',
        ),
      );
  }
}
