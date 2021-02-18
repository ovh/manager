import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import last from 'lodash/last';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

class PrivateNetworkListCtrl {
  constructor(
    $window,
    $rootScope,
    $translate,
    $stateParams,
    $state,
    $q,
    $uibModal,
    CloudProjectComputeInfrastructurePrivateNetworkService,
    OvhApiCloudProjectNetworkPrivate,
    OvhApiCloudProject,
    CucCloudMessage,
    OvhApiMe,
    URLS,
    OvhApiVrack,
    VrackSectionSidebarService,
    CucVrackService,
    CucCloudPoll,
    CucControllerHelper,
  ) {
    this.resources = {
      privateNetwork: OvhApiCloudProjectNetworkPrivate.v6(),
      project: OvhApiCloudProject.v6(),
      aapi: OvhApiVrack.Aapi(),
      modal: $uibModal,
    };
    this.CucCloudMessage = CucCloudMessage;
    this.$translate = $translate;
    this.serviceName = null;
    this.service = CloudProjectComputeInfrastructurePrivateNetworkService;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.User = OvhApiMe;
    this.URLS = URLS;
    this.CucCloudPoll = CucCloudPoll;
    this.VrackService = CucVrackService;
    this.CucControllerHelper = CucControllerHelper;

    this.loaders = {
      privateNetworks: {
        query: false,
        delete: false,
        activate: false,
      },
      vrack: {
        get: false,
        link: false,
        unlink: false,
        progress: 0,
      },
      vracks: {
        get: false,
      },
    };
    this.urls = {
      vrack: buildURL('dedicated', '#/configuration/vrack', {
        landingTo: 'networks',
      }),
    };
    this.models = {
      vrack: null,
    };
    this.collections = {
      privateNetworks: [],
    };
    this.states = {
      dialog: {
        visible: false,
      },
    };
    this.$window = $window;
    // get vRacks for current user, shown in left side bar
    this.vRacks = [];
    VrackSectionSidebarService.getVracks()
      .then((vRacks) => {
        this.vRacks = vRacks;
      })
      .finally(() => {
        this.loaders.vracks.get = false;
      });
  }

  $onInit() {
    this.resources.privateNetwork.resetAllCache();
    if (angular.isUndefined(this.$stateParams.projectId)) {
      this.CucCloudMessage.error(
        this.$translate.instant('cpci_private_network_list_context_error'),
      );
    } else {
      this.serviceName = this.$stateParams.projectId;
    }

    this.$rootScope.$on(
      'private-network-dialog:hide',
      this.hideDialog.bind(this),
    );
    this.$rootScope.$on(
      'private-networks:create',
      this.createPrivateNetworks.bind(this),
    );

    // Loading privateNetwork first because vrack can fallback to privateNetworkList
    // to find it's ID.
    this.fetchPrivateNetworks()
      .then(() => this.fetchVrack())
      .then(() => this.User.v6().get().$promise)
      .then((user) => {
        this.orderUrl = get(
          this.URLS.website_order,
          `vrack.${user.ovhSubsidiary}`,
        );
      })
      .then(() => this.VrackService.listOperations(this.$stateParams.projectId))
      .then((result) => {
        const [status] = filter(result, (f) => f.status !== 'completed');
        if (status) {
          this.loaders.vrack.link = true;
          this.pollOperationStatus(status.id);
        }
      });
  }

  fetchVrack() {
    if (this.loaders.vrack.get) {
      return this.$q.when();
    }
    this.loaders.vrack.get = true;

    return this.resources.project
      .vrack({ serviceName: this.serviceName })
      .$promise.then((vrack) => {
        this.models.vrack = vrack;
      })
      .then(() => this.getVrackId())
      .then((id) => {
        this.models.vrack.id = id;
      })
      .catch(() => {
        this.models.vrack = null;
      })
      .finally(() => {
        this.loaders.vrack.get = false;
      });
  }

  linkProjectToVrack(selectedVrack) {
    this.VrackService.linkCloudProjectToVrack(
      selectedVrack.serviceName,
      this.serviceName,
    )
      .$promise.then(
        (vrackTaskId) =>
          this.startVrackTaskPolling(this.models.vrack.id, vrackTaskId)
            .$promise,
      )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('cpci_private_network_add_vrack_success'),
        );
      })
      .catch((err) => {
        if (err !== 'cancel') {
          this.CucCloudMessage.error(
            this.$translate.instant('cpci_private_network_add_vrack_error'),
          );
        }
      })
      .finally(() => {
        this.loaders.vrack.link = false;
      });
  }

  createNewVrack() {
    return this.VrackService.createNewVrack(this.serviceName)
      .then(({ id }) => {
        this.pollOperationStatus(id);
      })
      .catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant('cpci_private_network_add_vrack_error'),
        );
        this.loaders.vrack.link = false;
      });
  }

  /**
   * open UI activate private network modal
   *
   * @memberof PrivateNetworkListCtrl
   */
  addVRack() {
    this.VrackService.selectVrack().then((selectedVrack) => {
      this.loaders.vrack.link = true;
      if (selectedVrack) {
        this.models.vrack = {
          id: selectedVrack.serviceName,
          name: selectedVrack.name,
        };
        this.linkProjectToVrack(selectedVrack);
      } else {
        this.createNewVrack();
      }
    });
  }

  pollOperationStatus(id) {
    this.startOperationPolling(id)
      .$promise.then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('cpci_private_network_add_vrack_success'),
        );
        this.fetchVrack();
      })
      .catch((err) => {
        if (err !== 'cancel') {
          this.CucCloudMessage.error(
            this.$translate.instant('cpci_private_network_add_vrack_error'),
          );
        }
      })
      .finally(() => {
        this.loaders.vrack.link = false;
      });
  }

  startOperationPolling(taskId) {
    this.stopTaskPolling();

    const taskToPoll = {
      id: taskId,
    };

    this.poller = this.CucCloudPoll.poll({
      item: taskToPoll,
      pollFunction: (task) =>
        this.VrackService.getOperation(this.serviceName, task.id).then(
          (res) => {
            this.loaders.vrack.progress = res.progress;
            return res;
          },
        ),
      stopCondition: (task) =>
        !task || includes(['completed', 'error'], task.status),
    });

    return this.poller;
  }

  unlinkVrack() {
    let hasVlansText = this.$translate.instant(
      'private_network_deactivate_confirmation',
    );
    if (this.collections.privateNetworks.length > 0) {
      hasVlansText += ` ${this.$translate.instant(
        'private_network_deactivate_confirmation_vlans',
      )}`;
    }
    this.VrackService.unlinkVrackModal(hasVlansText)
      .then(() => {
        this.loaders.vrack.unlink = true;
        return this.VrackService.unlinkCloudProjectFromVrack(
          this.models.vrack.id,
          this.serviceName,
        );
      })
      .then(
        (vrackTaskId) =>
          this.startVrackTaskPolling(this.models.vrack.id, vrackTaskId)
            .$promise,
      )
      .then(() => {
        this.models.vrack = null;
        this.collections.privateNetworks = [];
        this.CucCloudMessage.success(
          this.$translate.instant('cpci_private_network_remove_vrack_success'),
        );
      })
      .catch((err) => {
        if (err !== 'cancel') {
          this.CucCloudMessage.error(
            this.$translate.instant('cpci_private_network_remove_vrack_error'),
          );
        }
      })
      .finally(() => {
        this.loaders.vrack.unlink = false;
      });
  }

  startVrackTaskPolling(vrack, taskId) {
    this.stopTaskPolling();

    const taskToPoll = {
      id: taskId,
    };

    this.poller = this.CucCloudPoll.poll({
      item: taskToPoll,
      pollFunction: (task) => this.VrackService.getTask(vrack, task.id),
      stopCondition: (task) =>
        !task || includes(['done', 'error'], task.status),
    });

    return this.poller;
  }

  stopTaskPolling() {
    if (this.poller) {
      this.poller.kill();
    }
  }

  deletePrivateNetwork(privateNetwork) {
    const modal = this.resources.modal.open({
      windowTopClass: 'cui-modal',
      templateUrl:
        'app/cloud/project/compute/infrastructure/privateNetwork/delete/cloud-project-compute-infrastructure-privateNetwork-delete.html',
      controller: 'CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl',
      controllerAs: 'CloudprojectcomputeinfrastructureprivatenetworkdeleteCtrl',
      resolve: {
        params: () => privateNetwork,
      },
    });
    modal.result
      .then(() => {
        this.loaders.privateNetworks.delete = true;
      })
      .finally(() => {
        this.loaders.privateNetworks.delete = false;
        this.deletePrivateNetworkFromList(privateNetwork);
      });
  }

  deletePrivateNetworkFromList(privateNetwork) {
    const newPrivateNetworks = this.collections.privateNetworks.filter(
      (el) => el.id !== privateNetwork,
    );
    this.collections.privateNetworks = newPrivateNetworks;
    return this.collections;
  }

  createPrivateNetworks(event, args) {
    this.hideDialog();
    const subnets = map(
      filter(values(args.subnets), (subnet) =>
        includes(args.privateNetwork.regions, subnet.region),
      ),
      (subnet) =>
        assign(subnet, {
          dhcp: args.isDHCPEnabled,
          network: args.globalNetwork,
        }),
    );

    const onNetworkCreated = function onNetworkCreated(network) {
      const promises = map(
        subnets,
        (subnet) =>
          this.service.saveSubnet(args.projectId, network.id, subnet).$promise,
        this,
      );
      return this.$q.all(promises).then(() => this.fetchPrivateNetworks());
    }.bind(this);

    this.service.savePrivateNetwork(
      args.projectId,
      args.privateNetwork,
      onNetworkCreated,
    );
  }

  fetchPrivateNetworks() {
    if (this.loaders.privateNetworks.query) {
      return this.$q.when(null);
    }
    this.loaders.privateNetworks.query = true;

    return this.resources.privateNetwork
      .query({
        serviceName: this.serviceName,
      })
      .$promise.then((networks) => {
        this.collections.privateNetworks = networks;
        forEach(this.collections.privateNetworks, (network) => {
          if (network.id) {
            set(network, 'shortVlanId', last(network.id.split('_')));
          }
        });
      })
      .catch(() => {
        this.collections.privateNetworks = [];
        this.CucCloudMessage.error(
          this.$translate.instant(
            'cpci_private_network_list_private_network_query_error',
          ),
        );
      })
      .finally(() => {
        this.loaders.privateNetworks.query = false;
      });
  }

  getPrivateNetworks() {
    return sortBy(this.collections.privateNetworks, 'vlanId');
  }

  getVrackName() {
    if (has(this.models.vrack, 'name') && !isEmpty(this.models.vrack.name)) {
      return this.models.vrack.name;
    }
    if (has(this.models.vrack, 'id') && !isEmpty(this.models.vrack.id)) {
      return this.models.vrack.id;
    }
    return this.$translate.instant('cpci_private_network_list_vrack_unnamed');
  }

  getVrackId() {
    if (has(this.models.vrack, 'id') && !isEmpty(this.models.vrack.id)) {
      return this.$q.when(this.models.vrack.id);
    }

    if (isEmpty(this.models.vrack.name)) {
      return this.fetchPrivateNetworks().then(() => {
        if (some(this.collections.privateNetworks)) {
          return head(head(this.collections.privateNetworks).id.split('_'));
        }
        return this.$q.when(null);
      });
    }

    return this.resources.aapi
      .query()
      .$promise.then((vracks) => {
        const vrack = find(vracks, { name: this.models.vrack.name });
        return get(vrack, 'id', null);
      })
      .catch(() => null);
  }

  gotoVrack() {
    this.getVrackId().then((id) => this.$state.go('vrack', { vrackId: id }));
  }

  canGotoVrack() {
    return this.hasVrack() && !isNull(this.models.vrack.id);
  }

  hasVrack() {
    return this.loaders.vrack.get === false && !isNull(this.models.vrack);
  }

  showDialog() {
    this.states.dialog.visible = true;
  }

  hideDialog() {
    this.states.dialog.visible = false;
    this.$rootScope.$broadcast('cuc-highlighted-element.hide', 'compute');
  }

  toggleDialog() {
    this.states.dialog.visible = !this.states.dialog.visible;
  }

  hasVisibleDialog() {
    return this.states.dialog.visible;
  }

  hasPendingLoaders() {
    return (
      some(this.loaders, 'query', true) ||
      some(this.loaders, 'get', true) ||
      some(this.loaders, 'link', true) ||
      some(this.loaders, 'unlink', true) ||
      this.isVrackCreating()
    );
  }

  isVrackCreating() {
    return this.service.isSavePending();
  }

  onKeyDown($event) {
    switch ($event.which) {
      case 27:
        // Important not to put $event.preventDefault(); before the switch statement
        // since it will catch and prevent default
        // behavior on keyDown everywhere in the directive, inputs included.
        $event.preventDefault();
        this.hideDialog();
        break;
      default:
        break;
    }
  }
}

angular.module('managerApp').directive('privateNetworkList', () => ({
  restrict: 'E',
  templateUrl:
    'app/cloud/project/compute/infrastructure/privateNetwork/cloud-project-compute-infrastructure-privateNetwork-list.html',
  controller: PrivateNetworkListCtrl,
  controllerAs: '$ctrl',
  bindToController: true,
  replace: false,
}));
