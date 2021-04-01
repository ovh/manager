export default class ProjectListController {
  /* @ngInject */
  constructor($injector, $q, $translate, publicCloud, iceberg) {
    this.$injector = $injector;
    this.$q = $q;
    this.$translate = $translate;
    this.publicCloud = publicCloud;
    this.iceberg = iceberg;
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
    this.publicCloud
      .getProjects([
        {
          field: 'status',
          comparator: 'in',
          reference: ['creating', 'ok'],
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
}
