export default class ProjectListController {
  /* @ngInject */
  constructor(publicCloud, iceberg) {
    this.publicCloud = publicCloud;
    this.iceberg = iceberg;
  }

  $onInit() {
    this.getProjects();
  }

  getProjects() {
    this.isLoading = true;
    this
      .publicCloud
      .getProjects()
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
