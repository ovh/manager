import includes from 'lodash/includes';
import map from 'lodash/map';
import set from 'lodash/set';

export default class VrackService {
  /* @ngInject */
  constructor($q, $translate, CucControllerHelper, OvhApiCloudProject, OvhApiVrack) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiVrack = OvhApiVrack;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectV6 = OvhApiCloudProject.v6();
  }

  static getGroupedServiceTypes() {
    return ['dedicatedCloudDatacenter', 'dedicatedCloud', 'dedicatedServerInterface'];
  }

  isGroupedServiceType(serviceType) {
    return includes(this.constructor.getGroupedServiceTypes(), serviceType);
  }

  getVracks() {
    this.OvhApiVrack.Aapi().resetCache();
    return this.OvhApiVrack.Aapi().query().$promise.then((vracks) => {
      map(vracks, (vrack) => {
        set(vrack, 'serviceName', vrack.id);
        set(vrack, 'displayName', vrack.name || vrack.id);
      });
      return vracks;
    });
  }

  getOrderUrl() {
    return this.CucControllerHelper.navigation.getConstant('website_order.vrack');
  }

  selectVrackModal(vRacks, orderUrl) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/vrack/modals/selectVrack.html',
        controller: 'SelectVrackCtrl',
        controllerAs: '$ctrl',
        resolve: {
          params: () => ({
            orderUrl,
            vRacks,
          }),
        },
      },
    });
  }

  selectVrack() {
    return this.$q.all({
      orderUrl: this.getOrderUrl(),
      vracks: this.getVracks(),
    })
      .then(data => this.selectVrackModal(data.vracks, data.orderUrl));
  }

  linkCloudProjectToVrack(selectedVrack, projectId) {
    return this.OvhApiVrack.CloudProject().v6().create({
      serviceName: selectedVrack,
    }, {
      project: projectId,
    }).$promise
      .then(vrackTask => vrackTask.data.id);
  }

  createNewVrack(serviceName) {
    return this.OvhApiCloudProjectV6.createVrack({ serviceName }).$promise;
  }

  getOperation(serviceName, operationId) {
    return this.OvhApiCloudProjectV6.getOperation({ serviceName, operationId }).$promise;
  }

  listOperations(serviceName) {
    return this.OvhApiCloudProjectV6.operations({ serviceName }).$promise;
  }

  unlinkVrackModal(text) {
    return this.CucControllerHelper.modal.showConfirmationModal({
      submitButtonText: this.$translate.instant('vrack_common_deactivate'),
      titleText: this.$translate.instant('private_network_deactivate'),
      text: text || this.$translate.instant('private_network_deactivate_confirmation'),
    });
  }

  unlinkCloudProjectFromVrack(selectedVrack, projectId) {
    return this.OvhApiVrack.CloudProject().v6().delete({
      serviceName: selectedVrack,
      project: projectId,
    }).$promise
      .then(vrackTask => vrackTask.data.id);
  }

  getTask(serviceName, taskId) {
    return this.OvhApiVrack.v6().task({ serviceName, taskId }).$promise;
  }
}
