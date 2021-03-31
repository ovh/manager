import { CLOUD_PROJECT_STATE } from '../../../../constants';

export default class ProjectListController {
  /* @ngInject */
  constructor($injector, $translate, PciProjectsService) {
    this.$injector = $injector;
    this.$translate = $translate;
    this.PciProjectsService = PciProjectsService;
  }

  $onInit() {
    this.getProjects();
    this.getTranslations();
  }

  getTranslations() {
    this.isLoadingTranslations = true;

    return this.$injector
      .invoke(/* @ngTranslationsInject:json ./translations */)
      .then(() => this.$translate.refresh())
      .finally(() => {
        this.isLoadingTranslations = false;
      });
  }

  getProjects() {
    this.isLoading = true;
    this.PciProjectsService.getProjects([
      {
        field: 'status',
        comparator: 'in',
        reference: [
          CLOUD_PROJECT_STATE.creating,
          CLOUD_PROJECT_STATE.ok,
          CLOUD_PROJECT_STATE.suspended,
        ],
      },
    ])
      .then((projects) => {
        this.projects = projects;
      })
      .catch((err) => {
        this.err = err;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  goToProjectDetails(project) {
    return project.isSuspended() || project.hasPendingDebt()
      ? this.goToProjectInactive(project)
      : this.goToProject(project);
  }
}
