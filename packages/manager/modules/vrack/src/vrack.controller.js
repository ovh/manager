import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import keys from 'lodash/keys';
import last from 'lodash/last';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import merge from 'lodash/merge';
import reject from 'lodash/reject';
import remove from 'lodash/remove';
import startsWith from 'lodash/startsWith';
import uniq from 'lodash/uniq';
import values from 'lodash/values';
import without from 'lodash/without';

import angular from 'angular';

import moveDialogCtrl from './move-dialog/vrack-move-dialog.controller';
import moveDialogTpl from './move-dialog/vrack-move-dialog.html';
import constant from './vrack.constant';
import arrowIcon from '../assets/icon_vrack-mapper-arrows.svg';

export default /* @ngInject */ function VrackCtrl($scope, $q, $stateParams,
  $rootScope, $state, $timeout, $translate, $uibModal, CucCloudMessage,
  OvhApiVrack, OvhApiMe, CucVrackService) {
  const self = this;
  const pollingInterval = 5000;

  self.poller = null;
  self.serviceName = null;
  self.name = null;
  self.description = null;
  self.nameEditing = false;
  self.descriptionEditing = false;
  self.nameOptions = { pattern: /^([a-zA-Z])\S*$/, maxLength: 100 };
  self.descriptionOptions = { maxLength: 255 };
  self.changeOwnerUrl = null;
  self.vRackCloudRoadmapGuide = null;
  self.vrackService = CucVrackService;
  self.arrowIcon = arrowIcon;

  self.modals = {
    move: null,
  };

  self.messages = [];

  self.loaders = {
    init: false,
    adding: false,
    deleting: false,
    moving: false,
  };

  self.data = {
    cloudProjects: [],
    allowedServices: {},
    vrackServices: {},
    pendingTasks: [],
  };

  self.form = {
    servicesToAdd: [],
    servicesToDelete: [],
    serviceToMove: null,
  };

  self.states = {
    accordions: {
      available: {
        types: [],
        groups: [],
        dedicatedCloudNetworks: [],
      },
      mapped: {
        types: [],
        groups: [],
        dedicatedCloudNetworks: [],
        dedicatedCloudDatacenters: [],
      },
    },
  };
  self.refreshMessage = function refreshMessage() {
    self.messages = self.messageHandler.getMessages();
  };

  self.loadMessage = function loadMessage() {
    CucCloudMessage.unSubscribe('vrack');
    self.messageHandler = CucCloudMessage.subscribe('vrack', { onMessage: () => self.refreshMessage() });
  };

  self.groupedServiceKeys = {
    dedicatedCloudDatacenter: 'dedicatedCloud.niceName',
    dedicatedServerInterface: 'dedicatedServer.niceName',
  };

  self.getDisplayName = function getDisplayName(serviceType) {
    return $translate.instant(`vrack_service_type_${serviceType.toLowerCase()}`);
  };

  function getDedicatedServerNiceName(service) {
    const formattedService = {};
    angular.copy(service, formattedService);
    formattedService.id = service.name;
    // by default the reverse seem to be equal to the name,
    // so do not display redondant information.
    if (service.reverse && service.reverse !== service.name) {
      formattedService.niceName = `${service.name} (${service.reverse})`;
    } else {
      formattedService.niceName = service.name;
    }
    formattedService.trueServiceType = 'dedicatedServer';
    return formattedService;
  }

  function getDedicatedServerInterfaceNiceName(service) {
    const formattedService = getDedicatedServerNiceName(service.dedicatedServer);
    formattedService.id = service.dedicatedServerInterface;
    formattedService.niceName = `${formattedService.niceName} - ${service.name}`;
    formattedService.trueServiceType = 'dedicatedServerInterface';
    return formattedService;
  }

  function getDedicatedCloudNiceName(service) {
    const formattedService = {};
    angular.copy(service, formattedService);
    formattedService.id = service.serviceName;
    if (service.description) {
      formattedService.niceName = `${service.serviceName} (${service.description})`;
    } else {
      formattedService.niceName = service.serviceName;
    }
    formattedService.trueServiceType = 'dedicatedCloud';
    return formattedService;
  }

  function getCloudProjectNiceName(service) {
    const formattedService = {};
    angular.copy(service, formattedService);
    formattedService.id = service.project_id;
    if (service.description) {
      formattedService.niceName = service.description;
    } else {
      formattedService.niceName = service.project_id;
    }
    formattedService.trueServiceType = 'cloudProject';
    return formattedService;
  }

  function getIpLoadbalancingNiceName(service) {
    const formattedService = {};
    angular.copy(service, formattedService);
    formattedService.id = service.serviceName;
    if (service.displayName) {
      formattedService.niceName = service.displayName;
    } else {
      formattedService.niceName = service.serviceName;
    }
    formattedService.trueServiceType = 'ipLoadbalancing';
    return formattedService;
  }

  function fillServiceData(serviceType, service) {
    let formattedService = null;
    switch (serviceType) {
      case 'dedicatedServer':
        formattedService = getDedicatedServerNiceName(service);
        break;
      case 'dedicatedServerInterface':
        formattedService = getDedicatedServerInterfaceNiceName(service);
        break;
      case 'dedicatedCloud':
        formattedService = getDedicatedCloudNiceName(service);
        break;
      case 'dedicatedCloudDatacenter':
        formattedService = cloneDeep(service);
        formattedService.id = service.datacenter;
        formattedService.niceName = last(service.datacenter.split('_'));
        if (isObject(service.dedicatedCloud)) {
          formattedService.dedicatedCloud.niceName = `${service.dedicatedCloud.serviceName} (${service.dedicatedCloud.description})`;
        } else {
          formattedService.dedicatedCloud = {
            niceName: service.dedicatedCloud,
          };
        }
        formattedService.trueServiceType = 'dedicatedCloudDatacenter';
        break;
      case 'legacyVrack':
        formattedService = {
          id: service,
          niceName: service,
          trueServiceType: 'legacyVrack',
        };
        break;
      case 'ip':
        formattedService = {
          id: service,
          niceName: service,
          trueServiceType: 'ip',
        };
        break;
      case 'cloudProject':
        formattedService = getCloudProjectNiceName(service);
        break;
      case 'ipLoadbalancing':
        formattedService = getIpLoadbalancingNiceName(service);
        break;
      default:
        formattedService = cloneDeep(service);
        break;
    }
    return formattedService;
  }

  self.getAllowedServices = function getAllowedServices() {
    return OvhApiVrack.Aapi().allowedServices({ serviceName: self.serviceName }).$promise
      .then((allServicesParam) => {
        let allServices = allServicesParam;
        allServices = mapValues(allServices, (services, serviceType) => {
          if (isArray(services)) {
            return map(services, service => fillServiceData(serviceType, service));
          }
          return services;
        });

        // We need to append dedicatedServerInterfaces list to dedicatedServers list.
        if (has(allServices, 'dedicatedServerInterface') && allServices.dedicatedServerInterface.length > 0) {
          // If dedicatedServers list doesn't exist, we create it first.
          if (!has(allServices, 'dedicatedServer')) {
            allServices.dedicatedServer = [];
          }

          angular.forEach(allServices.dedicatedServerInterface, (serverInterface) => {
            allServices.dedicatedServer.push(serverInterface);
          });

          allServices.dedicatedServerInterface = [];
        }

        return allServices;
      });
  };

  self.getVrackServices = function getVrackServices() {
    return OvhApiVrack.Aapi().services({ serviceName: self.serviceName }).$promise
      .then((allServicesParam) => {
        let allServices = allServicesParam;
        allServices = mapValues(allServices, (servicesParams, serviceType) => {
          let services = servicesParams;
          if (isArray(services)) {
            services = map(services, service => fillServiceData(serviceType, service));
          }
          return services;
        });

        if (has(allServices, 'dedicatedCloudDatacenter')) {
          allServices.dedicatedCloudDatacenter = groupBy(
            allServices.dedicatedCloudDatacenter,
            self.groupedServiceKeys.dedicatedCloudDatacenter,
          );
        }

        // We need to append dedicatedServerInterfaces list to dedicatedServers list.
        if (has(allServices, 'dedicatedServerInterface') && allServices.dedicatedServerInterface.length > 0) {
          // If dedicatedServers list doesn't exist, we create it first.
          if (!has(allServices, 'dedicatedServer')) {
            allServices.dedicatedServer = [];
          }

          angular.forEach(allServices.dedicatedServerInterface, (serverInterface) => {
            allServices.dedicatedServer.push(serverInterface);
          });

          allServices.dedicatedServerInterface = [];
        }

        return allServices;
      });
  };

  self.getPendingTasks = function getPendingTasks() {
    return OvhApiVrack.v6()
      .tasks({
        serviceName: self.serviceName,
      }).$promise
      .then(taskIds => $q.all(map(taskIds, id => OvhApiVrack.v6()
        .task({
          serviceName: self.serviceName,
          taskId: id,
        }).$promise
        .then(task => task)
        .catch(err => (err.status === 404 ? $q.when(null) : $q.reject(err)))))
        .then(tasks => without(tasks, null)));
  };

  self.resetCache = function resetCache() {
    OvhApiVrack.v6().resetCache();
    OvhApiVrack.CloudProject().v6().resetQueryCache();
    OvhApiVrack.IpLoadBalancing().v6().resetQueryCache();
    OvhApiVrack.DedicatedCloud().v6().resetQueryCache();
    OvhApiVrack.DedicatedServer().v6().resetQueryCache();
    OvhApiVrack.DedicatedServerInterface().v6().resetQueryCache();
    OvhApiVrack.Ip().v6().resetQueryCache();
    OvhApiVrack.LegacyVrack().v6().resetQueryCache();
    OvhApiVrack.Aapi().resetAllCache();
  };

  self.moveDisplayedService = function moveDisplayedService(serviceId,
    allServicesSource, allServicesDestination) {
    let serviceToMove = null;
    let typeToMove = null;
    let isGroupedServicesType = false;
    forEach(allServicesSource, (services, type) => {
      const servicesToSearch = !isArray(allServicesSource[type])
        ? flatten(values(allServicesSource[type]))
        : allServicesSource[type];

      serviceToMove = remove(servicesToSearch, (service) => {
        if (service.id === serviceId) {
          typeToMove = type;
          isGroupedServicesType = !isArray(allServicesSource[type]);
          return true;
        }
        return null;
      });

      if (!isEmpty(serviceToMove)) {
        if (isGroupedServicesType) {
          allServicesSource[typeToMove] = groupBy(servicesToSearch, self.groupedServiceKeys[typeToMove]); // eslint-disable-line
        } else {
          allServicesSource[typeToMove] = servicesToSearch; // eslint-disable-line
        }

        return false;
      }
      return null;
    });

    if (serviceToMove && typeToMove) {
      if (isGroupedServicesType) {
        const services = flatten(values(allServicesDestination[typeToMove]));
        services.push(serviceToMove[0]);
        allServicesDestination[typeToMove] = groupBy(services, self.groupedServiceKeys[typeToMove]); // eslint-disable-line
      } else {
        allServicesDestination[typeToMove].push(serviceToMove[0]);
      }
    }
  };

  self.refreshData = function refreshData() {
    let poll = true;
    return self.getPendingTasks().then((tasks) => {
      /**
           * First, we check if there is any new pending tasks ...
           */
      const currentTasks = map(tasks, 'id');
      const previousTasks = map(self.data.pendingTasks, 'id');
      if (difference(currentTasks, previousTasks).length
        || difference(previousTasks, currentTasks).length) {
        self.resetCache(); // a task changed, vrack state might have changed too
      } else if (tasks.length === 0) {
        poll = false; // no new tasks & no tasks, no need to poll
      }
      /**
           * Secondly, we fetch vrack data ...
           */
      return $q.all({
        allowedServices: self.getAllowedServices(),
        vrackServices: self.getVrackServices(),
      }).then((result) => {
        self.data.pendingTasks = tasks;
        self.data.allowedServices = result.allowedServices;
        self.data.vrackServices = result.vrackServices;

        /**
               * Finally, check if some tasks are adding or removing services in vrack
               * and move the service in his "future" column
               */
        angular.forEach(self.data.pendingTasks, (task) => {
          if (task && task.targetDomain) {
            const id = task.targetDomain;
            const fn = task.function;
            if (startsWith(fn, 'add')) {
              self.moveDisplayedService(id, self.data.allowedServices, self.data.vrackServices);
            } else if (startsWith(fn, 'remove')) {
              self.moveDisplayedService(id, self.data.vrackServices, self.data.allowedServices);
            }
            self.form.servicesToAdd = reject(self.form.servicesToAdd, { id });
            self.form.servicesToDelete = reject(self.form.servicesToDelete, { id });
          }
        });
      });
    }).finally(() => {
      // if there are some pending tasks, poll
      if (poll && !self.poller) {
        self.poller = $timeout(() => {
          self.poller = null;
          self.refreshData();
        }, pollingInterval);
      }
      self.loaders.init = false;
    });
  };

  self.isSelected = function isSelected(serviceType, serviceId) {
    return angular.isDefined(find(self.form.servicesToAdd, {
      type: serviceType,
      id: serviceId,
    }))
     || angular.isDefined(find(self.form.servicesToDelete, {
       type: serviceType,
       id: serviceId,
     }))
     || isEqual(self.form.serviceToMove, { type: serviceType, id: serviceId });
  };

  self.isPending = function isPending(serviceId) {
    const ids = uniq(map(self.data.pendingTasks, 'targetDomain'));
    return ids.indexOf(serviceId) >= 0;
  };

  self.toggleAddService = function toggleAddService(serviceType, serviceId) {
    if (!self.isPending(serviceId) && !self.loaders.adding && !self.loaders.deleting) {
      const toAdd = { type: serviceType, id: serviceId };
      if (find(self.form.servicesToAdd, toAdd)) {
        self.form.servicesToAdd = reject(self.form.servicesToAdd, toAdd);
      } else {
        self.form.servicesToAdd.push(toAdd);
      }
      self.form.serviceToMove = null;
      self.form.servicesToDelete = [];
    }
  };

  self.toggleDeleteService = function toggleDeleteService(serviceType, serviceId) {
    if (!self.isPending(serviceId) && !self.loaders.adding && !self.loaders.deleting) {
      const toDelete = { type: serviceType, id: serviceId };
      if (find(self.form.servicesToDelete, toDelete)) {
        self.form.servicesToDelete = reject(self.form.servicesToDelete, toDelete);
      } else {
        self.form.servicesToDelete.push(toDelete);
      }
      self.form.serviceToMove = null;
      self.form.servicesToAdd = [];
    }
  };

  self.toggleMoveService = function toggleMoveService(serviceType, serviceId) {
    if (self.isPending(serviceId) || self.loaders.moving) {
      return;
    }
    const toMove = { type: serviceType, id: serviceId };
    if (self.form.serviceToMove === null) {
      self.form.servicesToAdd = [];
      self.form.servicesToDelete = [];
      self.form.serviceToMove = toMove;
    } else {
      self.form.serviceToMove = null;
    }
  };

  self.editName = function editName() {
    self.nameEditing = true;
    self.nameBackup = self.name;
  };

  self.cancelEditName = function cancelEditName() {
    self.nameEditing = false;
    self.name = self.nameBackup;
  };

  self.saveName = function saveName() {
    self.nameEditing = false;

    OvhApiVrack.v6().edit({ serviceName: self.serviceName }, { name: self.name }).$promise
      .then(() => $rootScope.$broadcast('global_display_name_change', {
        serviceName: self.serviceName,
        displayName: self.name,
      }))
      .catch((err) => {
        self.name = self.nameBackup;
        CucCloudMessage.error([$translate.instant('vrack_error'), (err.data && err.data.message) || err.message || ''].join(' '));
      })
      .finally(() => {
        self.nameBackup = null;
      });
  };

  self.editDescription = function editDescription() {
    self.descriptionEditing = true;
    self.descriptionBackup = self.description;
  };

  self.cancelEditDescription = function cancelEditDescription() {
    self.descriptionEditing = false;
    self.description = self.descriptionBackup;
  };

  self.saveDescription = function saveDescription() {
    self.descriptionEditing = false;
    OvhApiVrack.v6()
      .edit({ serviceName: self.serviceName }, { description: self.description }).$promise
      .catch((err) => {
        self.description = self.descriptionBackup;
        CucCloudMessage.error([$translate.instant('vrack_error'), (err.data && err.data.message) || err.message || ''].join(' '));
      })
      .finally(() => {
        self.descriptionBackup = null;
      });
  };

  self.addSelectedServices = function addSelectedServices() {
    self.loaders.adding = true;
    return $q.all(map(self.form.servicesToAdd, (service) => {
      let task = $q.reject('Unknown service type');
      switch (service.type) {
        case 'dedicatedServer':
          task = OvhApiVrack.DedicatedServer().v6().create({
            serviceName: self.serviceName,
          }, {
            dedicatedServer: service.id,
          }).$promise;
          break;
        case 'dedicatedServerInterface':
          task = OvhApiVrack.DedicatedServerInterface().v6().post({
            serviceName: self.serviceName,
          }, {
            dedicatedServerInterface: service.id,
          }).$promise;
          break;
        case 'dedicatedCloud':
          task = OvhApiVrack.DedicatedCloud().v6().create({
            serviceName: self.serviceName,
          }, {
            dedicatedCloud: service.id,
          }).$promise;
          break;
        case 'legacyVrack':
          task = OvhApiVrack.LegacyVrack().v6().create({
            serviceName: self.serviceName,
          }, {
            legacyVrack: service.id,
          }).$promise;
          break;
        case 'ip':
          task = OvhApiVrack.Ip().v6().create({
            serviceName: self.serviceName,
          }, {
            block: service.id,
          }).$promise;
          break;
        case 'cloudProject':
          task = OvhApiVrack.CloudProject().v6().create({
            serviceName: self.serviceName,
          }, {
            project: service.id,
          }).$promise;
          break;
        case 'ipLoadbalancing':
          task = OvhApiVrack.IpLoadBalancing().v6().create({
            serviceName: self.serviceName,
          }, {
            ipLoadbalancing: service.id,
          }).$promise;
          break;
        default:
          break;
      }
      return task.catch((err) => {
        CucCloudMessage.error([$translate.instant('vrack_add_error'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      });
    })).then(() => self.refreshData()).finally(() => {
      self.form.servicesToAdd = [];
      self.loaders.adding = false;
    });
  };

  self.deleteSelectedServices = function deleteSelectedServices() {
    self.loaders.deleting = true;
    return $q.all(map(self.form.servicesToDelete, (service) => {
      let task = $q.reject('Unknown service type');
      switch (service.type) {
        case 'dedicatedServer':
          task = OvhApiVrack.DedicatedServer().v6().delete({
            serviceName: self.serviceName,
            dedicatedServer: service.id,
          }).$promise;
          break;
        case 'dedicatedServerInterface':
          task = OvhApiVrack.DedicatedServerInterface().v6().delete({
            serviceName: self.serviceName,
            dedicatedServerInterface: service.id,
          }).$promise;
          break;
        case 'dedicatedCloud':
          task = OvhApiVrack.DedicatedCloud().v6().delete({
            serviceName: self.serviceName,
            dedicatedCloud: service.id,
          }).$promise;
          break;
        case 'legacyVrack':
          task = OvhApiVrack.LegacyVrack().v6().delete({
            serviceName: self.serviceName,
            legacyVrack: service.id,
          }).$promise;
          break;
        case 'ip':
          task = OvhApiVrack.Ip().v6().delete({
            serviceName: self.serviceName,
            ip: service.id,
          }).$promise;
          break;
        case 'cloudProject':
          task = OvhApiVrack.CloudProject().v6().delete({
            serviceName: self.serviceName,
            project: service.id,
          }).$promise;
          break;
        case 'ipLoadbalancing':
          task = OvhApiVrack.IpLoadBalancing().v6().delete({
            serviceName: self.serviceName,
            ipLoadbalancing: service.id,
          }).$promise;
          break;
        default:
          break;
      }
      return task.catch((err) => {
        CucCloudMessage.error([$translate.instant('vrack_remove_error'), (err.data && err.data.message) || ''].join(' '));
        return $q.reject(err);
      });
    })).then(() => self.refreshData()).finally(() => {
      self.form.servicesToDelete = [];
      self.loaders.deleting = false;
    });
  };

  self.moveSelectedService = function moveSelectedService() {
    self.modals.move = $uibModal.open({
      windowTopClass: 'cui-modal',
      template: moveDialogTpl,
      controller: moveDialogCtrl,
      controllerAs: 'ctrl',
      resolve: {
        service() {
          return merge(self.form.serviceToMove, {
            vrack: self.serviceName,
          });
        },
      },
    });

    self.modals.move.result.then(() => {
      self.refreshData();
    }).finally(() => {
      self.form.serviceToMove = null;
    });
  };

  self.setAccordionState = function setAccordionState(side, kind, offset, value) {
    self.states.accordions[side][kind][offset] = value;
  };

  self.getAccordionState = function getAccordionState(side, kind, offset) {
    if (!has(self.states.accordions, [side, kind, offset])) {
      return true;
    }

    return self.states.accordions[side][kind][offset];
  };

  self.toggleAccordion = function toggleAccordion(side, kind, offset) {
    self.states.accordions[side][kind][offset] = !self.states.accordions[side][kind][offset];
  };

  self.isAdding = function isAdding() {
    return self.form.servicesToAdd.length > 0 && !self.loaders.adding;
  };

  self.isRemoving = function isRemoving() {
    return self.form.servicesToDelete.length > 0 && !self.loaders.deleting;
  };

  self.isMoving = function isMoving() {
    return self.form.serviceToMove !== null && !self.loaders.moving;
  };

  self.hasVrackGuideUrl = function hasVrackGuideUrl() {
    return false;
  };

  self.hasServices = function hasServices(services) {
    return keys(services).length > 0;
  };

  function setUserRelatedContent() {
    OvhApiMe.v6().get().$promise
      .then((user) => {
        if (user.ovhSubsidiary === 'FR') {
          // Roadmap is only available in french
          self.vRackCloudRoadmapGuide = constant.VRACK_URLS.guides.vrack.FR;
        }
        self.changeOwnerUrl = constant.VRACK_URLS.changeOwner[user.ovhSubsidiary];
      });
  }

  function init() {
    self.loaders.init = true;
    self.loadMessage();
    if (isEmpty($stateParams.vrackId)) {
      OvhApiVrack.v6().query().$promise
        .then((vracks) => {
          if (isEmpty(vracks)) {
            $state.go('vrack-add');
          } else {
            $state.go('vrack', { vrackId: vracks[0] });
          }
        }).catch(() => {
          $state.go('vrack-add');
        });
    } else {
      // check if the serviceName is valid before loading the services
      OvhApiVrack.v6().get({
        serviceName: $stateParams.vrackId,
      }).$promise.then((resp) => {
        self.serviceName = $stateParams.vrackId;
        self.name = resp.name;
        self.description = resp.description;
        setUserRelatedContent();
        self.refreshData();
      }).catch((err) => {
        CucCloudMessage.error([$translate.instant('vrack_error'), (err.data && err.data.message) || ''].join(' '));
      });
    }
  }

  init();

  $scope.$on('$destroy', () => {
    if (self.poller) {
      $timeout.cancel(self.poller);
    }
  });
}
