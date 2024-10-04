import {
  REPOSITORY_PLACEHOLDER,
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  REGEX_GIT_REPO,
  GIT_ASSOCIATION_GUIDE_LINK,
  GIT_WEBHOOK_GUIDE_LINK,
} from './git-association.constants';
import { TRACKING_MULTISITE_PREFIX } from '../git-integration.constants';

export default class HostingMultisiteGitAssociationController {
  /* @ngInject */
  constructor(
    HostingMultisiteGitAssociationService,
    coreURLBuilder,
    coreConfig,
    atInternet,
    $translate,
  ) {
    this.REPOSITORY_PLACEHOLDER = REPOSITORY_PLACEHOLDER;
    this.EXAMPLE_BRANCHES_NAMES = EXAMPLE_BRANCHES_NAMES;
    this.EXAMPLE_HTTPS_REPOSITORY_URL = EXAMPLE_HTTPS_REPOSITORY_URL;
    this.GITHUB_VCS = GITHUB_VCS;
    this.EXAMPLE_SSH_REPOSITORY_URL = EXAMPLE_SSH_REPOSITORY_URL;
    this.REGEX_GIT_REPO = REGEX_GIT_REPO;
    this.HostingMultisiteGitAssociationService = HostingMultisiteGitAssociationService;
    this.coreURLBuilder = coreURLBuilder;
    this.$translate = $translate;
    this.atInternet = atInternet;
    const { ovhSubsidiary } = coreConfig.getUser();
    this.GIT_ASSOCIATION_GUIDE_LINK =
      GIT_ASSOCIATION_GUIDE_LINK[ovhSubsidiary] ||
      GIT_ASSOCIATION_GUIDE_LINK.DEFAULT;
    this.GIT_WEBHOOK_GUIDE_LINK =
      GIT_WEBHOOK_GUIDE_LINK[ovhSubsidiary] || GIT_WEBHOOK_GUIDE_LINK.DEFAULT;
  }

  $onInit() {
    this.ongoingTasksHref = this.coreURLBuilder.buildURL(
      'web',
      `#/hosting/${this.serviceName}/task`,
    );
    this.model = {
      repositoryUrl: null,
      branchName: null,
    };
    if (this.isConfiguration) {
      this.HostingMultisiteGitAssociationService.getVcsInformations(
        this.serviceName,
        this.path,
      ).then((branchNameAndRepoUrl) => {
        const { id, ...rest } = branchNameAndRepoUrl;
        this.websiteId = id;
        this.model = rest;
      });
    }
  }

  applyConfiguration() {
    this.atInternet.trackClick({
      name: `${TRACKING_MULTISITE_PREFIX}::git-association::confirm`,
      type: 'action',
    });
    const promise = this.isConfiguration
      ? this.HostingMultisiteGitAssociationService.putWebsiteAssociated(
          this.serviceName,
          this.model.branchName,
          this.websiteId,
        )
      : this.HostingMultisiteGitAssociationService.postWebsiteAssociated(
          this.serviceName,
          this.path,
          this.model.branchName,
          this.model.repositoryUrl,
        );

    promise
      .then(() =>
        this.goBack(
          this.$translate.instant(
            this.isConfiguration
              ? 'hosting_multisite_git_association_reconfigure_success'
              : 'hosting_multisite_git_association_success_message',
            { href: this.ongoingTasksHref },
          ),
          'success',
          true,
        ),
      )
      .catch(({ data: { message } }) =>
        this.goBack(
          this.$translate.instant(
            this.isConfiguration
              ? 'hosting_multisite_git_association_reconfigure_error'
              : 'hosting_multisite_git_association_error_message',
            { errorMessage: message },
          ),
          'danger',
        ),
      );
  }
}
