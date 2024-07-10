import {
  REPOSITORY_PLACEHOLDER,
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  REGEX_GIT_REPO,
  GIT_ASSOCIATION_GUIDE_LINK,
} from './git-association.constants';

export default class HostingMultisiteGitAssociationController {
  /* @ngInject */
  constructor(
    HostingMultisiteGitAssociationService,
    coreURLBuilder,
    coreConfig,
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
    this.GIT_ASSOCIATION_GUIDE_LINK =
      GIT_ASSOCIATION_GUIDE_LINK[coreConfig.getUser().ovhSubsidiary] ||
      GIT_ASSOCIATION_GUIDE_LINK.DEFAULT;
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
  }

  applyConfiguration() {
    this.HostingMultisiteGitAssociationService.postWebsiteAssociated(
      this.serviceName,
      this.path,
      this.model.branchName,
      this.model.repositoryUrl,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_success_message',
            { href: this.ongoingTasksHref },
          ),
          'success',
          true,
        ),
      )
      .catch(({ data: { message } }) =>
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_error_message',
            { errorMessage: message },
          ),
          'danger',
        ),
      );
  }
}
