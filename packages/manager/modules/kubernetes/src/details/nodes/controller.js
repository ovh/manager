import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import set from 'lodash/set';

import { STATUS } from '../constants';

import addController from './add/controller';
import addTemplate from './add/template.html';

import deleteController from './delete/controller';
import deleteTemplate from './delete/template.html';

export default class KubernetesNodesCtrl {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $timeout, $translate, $uibModal,
    CucCloudMessage, Kubernetes,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.CucCloudMessage = CucCloudMessage;
    this.Kubernetes = Kubernetes;
    this.STATUS = STATUS;
  }

  $onInit() {
    this.loading = true;

    this.getPublicCloudProject()
      .then(() => this.getInfo())
      .then(() => this.loadMessages())
      .finally(() => { this.loading = false; });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('kube.nodes');
    this.messageHandler = this.CucCloudMessage.subscribe('kube.nodes', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getCluster() {
    return this.Kubernetes.getKubernetesCluster(this.serviceName)
      .then((cluster) => { this.cluster = cluster; })
      .catch((error) => {
        this.cluster = { id: this.serviceName, name: this.serviceName };
        this.CucCloudMessage.error(this.$translate.instant('kube_error', { message: get(error, 'data.message') }));
      });
  }

  getInfo() {
    return this.$q.all([
      this.getNodes(),
      this.getCluster(),
    ]);
  }

  getNodes() {
    return this.Kubernetes.getNodes(this.serviceName)
      .then((nodes) => { this.nodes = nodes; })
      .catch(() => this.CucCloudMessage.error(this.$translate.instant('kube_nodes_error')));
  }

  getAssociatedFlavor(node) {
    return this.Kubernetes.getFlavors(node.projectId)
      .then((flavors) => {
        set(node, 'formattedFlavor', this.Kubernetes.formatFlavor(
          find(flavors, { name: node.flavor }),
        ));
      })
      .catch(() => {
        set(node, 'formattedFlavor', this.$translate.instant('kube_nodes_flavor_error'));
      });
  }

  getPublicCloudProject() {
    return this.Kubernetes.getAssociatedPublicCloudProjects(this.serviceName)
      .then(projects => this.Kubernetes.getProject(head(projects).projectId))
      .then((project) => {
        this.project = project;
      })
      .catch(() => {
        this.CucCloudMessage.error(this.$translate.instant('kube_nodes_project_error'));
      });
  }

  confirmNodeDeletion(nodeId) {
    return this.$uibModal.open({
      template: deleteTemplate,
      controller: deleteController,
      controllerAs: '$ctrl',
      backdrop: 'static',
      openedClass: 'kubernetes',
      resolve: {
        nodeId() {
          return nodeId;
        },
      },
    }).result
      .then(() => {
        this.displaySuccessMessage('kube_nodes_delete_success');
        return this.refreshNodes();
      })
      .catch((error) => {
        if (error) {
          this.CucCloudMessage.error(this.$translate.instant('kube_nodes_delete_error', { message: error }));
        }
      });
  }

  openAddNodeForm(projectId) {
    return this.$uibModal.open({
      template: addTemplate,
      controller: addController,
      controllerAs: '$ctrl',
      backdrop: 'static',
      openedClass: 'kubernetes',
      resolve: {
        projectId() {
          return projectId;
        },
      },
    }).result
      .then(() => {
        this.displaySuccessMessage('kube_nodes_add_success');
        return this.refreshNodes();
      })
      .catch((error) => {
        if (error) {
          this.CucCloudMessage.error(error);
        }
      });
  }

  displaySuccessMessage(message) {
    this.CucCloudMessage.success(this.$translate.instant(message));
    this.$timeout(() => this.CucCloudMessage.flushMessages(), 3000);
  }

  refreshNodes() {
    this.loading = true;
    this.Kubernetes.resetClusterCache();
    this.Kubernetes.resetNodesCache();
    return this.getInfo()
      .finally(() => { this.loading = false; });
  }
}
