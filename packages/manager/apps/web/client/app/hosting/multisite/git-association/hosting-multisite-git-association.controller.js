import {
  REPOSITORY_PLACEHOLDER,
  EXAMPLE_BRANCHES_NAMES,
  EXAMPLE_HTTPS_REPOSITORY_URL,
  EXAMPLE_SSH_REPOSITORY_URL,
  GITHUB_VCS,
  REGEX_GIT_REPO,
  PATH_PREFIX,
} from './hosting-multisite-git-association.constants';

export default class HostingMultisiteGitAssociationController {
  /* @ngInject */
  constructor(HostingMultisiteGitAssociationService, coreURLBuilder) {
    this.REPOSITORY_PLACEHOLDER = REPOSITORY_PLACEHOLDER;
    this.EXAMPLE_BRANCHES_NAMES = EXAMPLE_BRANCHES_NAMES;
    this.EXAMPLE_HTTPS_REPOSITORY_URL = EXAMPLE_HTTPS_REPOSITORY_URL;
    this.GITHUB_VCS = GITHUB_VCS;
    this.EXAMPLE_SSH_REPOSITORY_URL = EXAMPLE_SSH_REPOSITORY_URL;
    this.PATH_PREFIX = PATH_PREFIX;
    this.REGEX_GIT_REPO = REGEX_GIT_REPO;
    this.HostingMultisiteGitAssociationService = HostingMultisiteGitAssociationService;
    this.model = {
      repositoryUrl: null,
      branchName: null,
      webhookUrl: '',
    };
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.errorMessage = !this.sshKey;
    this.ongoingTasksHref = this.coreURLBuilder.buildURL(
      'web',
      `#/hosting/${this.serviceName}/task`,
    );
  }

  applyConfiguration() {
    this.HostingMultisiteGitAssociationService.getVcsWebhookUrls(
      this.serviceName,
      this.path,
      this.GITHUB_VCS,
    )
      .then(({ push }) => {
        this.model.webhookUrl = push;
      })
      .catch(({ status }) => {
        this.statusCode = status;
      });
  }
}
