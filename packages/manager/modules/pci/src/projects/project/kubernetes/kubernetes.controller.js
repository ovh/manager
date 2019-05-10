import { REGION } from './kubernetes.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PublicCloudProjectKubernetes,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PublicCloudProjectKubernetes = PublicCloudProjectKubernetes;
  }

  $onInit() {
    this.loadMessages();
    return this.getProjectKubernetes();
  }


  loadMessages() {
    this.CucCloudMessage.unSubscribe('kubernetes');
    this.messageHandler = this.CucCloudMessage.subscribe('kubernetes', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }


  getProjectKubernetes() {
    return this.PublicCloudProjectKubernetes.getProjectKubernetes(this.projectId)
      .then(({ results, errors }) => {
        this.kubes = results.map(id => ({ id, region: REGION }));

        if (errors.some(({ code }) => code !== 460)) {
          this.CucCloudMessage.error(this.$translate.instant('kube_list_error'));
        }
      })
      .catch(() => {
        this.CucCloudMessage.error(this.$translate.instant('kube_list_error'));
      });
  }

  getKubernetes({ id }) {
    return this.PublicCloudProjectKubernetes.getKubernetes(id);
  }

  static getDetailsState(id) {
    return `pci.projects.project.kubernetes.details({ serviceName: '${id}'})`;
  }
}
