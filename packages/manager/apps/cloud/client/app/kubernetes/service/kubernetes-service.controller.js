import find from 'lodash/find';
import set from 'lodash/set';

angular.module('managerApp').controller('KubernetesServiceCtrl', class KubernetesServiceCtrl {
  constructor($scope, $state, $stateParams, $translate, CucCloudMessage, CucControllerHelper,
    Kubernetes, KUBERNETES) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.Kubernetes = Kubernetes;
    this.KUBERNETES = KUBERNETES;
    this.upgradePolicy = null;
  }

  $onInit() {
    this.loaders = {
      cluster: true,
      billing: true,
      config: true,
    };

    this.$scope.$on('kube.service.refresh', () => this.getClusterInfos());

    this.getClusterInfos()
      .then(() => this.getConfigFile())
      .then(() => this.getBillingInfos())
      .then(() => this.loadMessages());
  }

  rename(displayName) {
    delete this.cluster.region;
    this.cluster.name = displayName;
    return this.Kubernetes.updateKubernetes(this.serviceName, this.cluster);
  }

  changeClusterName() {
    this.CucControllerHelper.modal.showNameChangeModal({
      serviceName: this.serviceName,
      displayName: this.cluster.name,
      onSave: newDisplayName => this.rename(newDisplayName)
        .then(() => this.$scope.$emit('changeKubernetesName', newDisplayName))
        .then(() => this.getClusterInfos()),
    });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('paas.kube.service');
    this.messageHandler = this.CucCloudMessage.subscribe('paas.kube.service', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getClusterInfos() {
    return this.Kubernetes.getKubernetesCluster(this.serviceName)
      .then((cluster) => {
        this.cluster = cluster;
        set(this.cluster, 'region', this.KUBERNETES.region);
        this.setUpgradePolicy();
      })
      .catch(() => { this.displayError = true; })
      .finally(() => { this.loaders.cluster = false; });
  }

  getBillingInfos() {
    return this.Kubernetes.getKubernetesServiceInfos(this.serviceName)
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
        // Static for now
        set(this.serviceInfos, 'offer', this.$translate.instant('kube_service_offer_beta'));
      })
      .catch(() => { this.displayError = true; })
      .finally(() => { this.loaders.billing = false; });
  }

  getConfigFile() {
    return this.Kubernetes.getKubernetesConfig(this.serviceName)
      .then((fileConfig) => {
        this.kubernetesConfig = {
          content: fileConfig.content,
          fileName: this.KUBERNETES.kubeconfigFileName,
        };
      })
      .catch(() => {
        this.CucCloudMessage.error(this.$translate.instant('kube_service_file_error'));
      })
      .finally(() => {
        this.loaders.config = false;
      });
  }

  downloadConfigFile() {
    // Set yml extension manually as there is no MIME type yet
    this.CucControllerHelper.constructor.downloadContent({ fileContent: this.kubernetesConfig.content, fileName: `${this.kubernetesConfig.fileName}.yml` });
  }

  resetCluster() {
    return this.$state.go('paas.kube.service.reset', {
      cluster: this.cluster,
    });
  }

  setUpgradePolicy() {
    this.upgradePolicy = find(this.Kubernetes.getUpgradePolicies(),
      policy => policy.value === this.cluster.updatePolicy);
  }

  showUgradePolicy() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/kubernetes/service/upgrade-policy/kubernetes-service-upgrade-policy.html',
        controller: 'kubernetesUpgradePolicyCtrl',
        controllerAs: '$ctrl',
        backdrop: 'static',
        resolve: {
          upgradePolicy: () => this.cluster.updatePolicy,
        },
      },
      successHandler: (newUpdatePolicy) => {
        this.cluster.updatePolicy = newUpdatePolicy;
        this.setUpgradePolicy();
      },
    });
  }

  updateCluster() {
    return this.$state.go('paas.kube.service.update', {
      cluster: this.cluster,
    });
  }

  terminate() {
    return this.$state.go('paas.kube.service.terminate', {
      cluster: this.cluster,
    });
  }
});
