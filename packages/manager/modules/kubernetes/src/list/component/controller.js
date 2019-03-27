import { REGION } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    PublicCloudProjectKubernetes,
  ) {
    this.$translate = $translate;
    this.PublicCloudProjectKubernetes = PublicCloudProjectKubernetes;
  }

  $onInit() {
    return this.getProjectKubernetes();
  }

  getProjectKubernetes() {
    return this.PublicCloudProjectKubernetes.getProjectKubernetes(this.projectId)
      .then(({ results, errors }) => {
        this.kubes = results.map(id => ({ id, region: REGION }));

        if (errors.some(({ code }) => code !== 460)) {
          this.errorMessage = this.$translate.instant('kube_list_error');
        }
      })
      .catch(() => {
        this.errorMessage = this.$translate.instant('kube_list_error');
      });
  }

  getKubernetes({ id }) {
    return this.PublicCloudProjectKubernetes.getKubernetes(id);
  }

  static getDetailsState(id) {
    return `kube({ serviceName: '${id}'})`;
  }
}
