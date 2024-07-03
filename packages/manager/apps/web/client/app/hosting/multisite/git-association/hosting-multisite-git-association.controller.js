import {
  REPOSITORY_PLACEHOLDER,
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  REGEX_GIT_REPO,
} from './hosting-multisite-git-association.constants';

export default class HostingMultisiteGitAssociationController {
  /* @ngInject */
  constructor(
    HostingMultisiteGitAssociationService,
    coreURLBuilder,
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
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_success_message',
            { href: this.ongoingTasksHref },
          ),
        );
      })
      .catch(({ data: { message } }) => {
        this.goBack(
          this.$translate.instant(
            'hosting_multisite_git_association_error_message',
            { errorMessage: message },
          ),
          'error',
        );
      });
  }
}
