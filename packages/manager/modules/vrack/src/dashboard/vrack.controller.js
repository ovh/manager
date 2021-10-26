import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
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
import pickBy from 'lodash/pickBy';
import reject from 'lodash/reject';
import remove from 'lodash/remove';
import startsWith from 'lodash/startsWith';
import uniq from 'lodash/uniq';
import values from 'lodash/values';
import without from 'lodash/without';

import angular from 'angular';

import {
  FEATURE_NAMES,
  POLLING_INTERVAL,
  STATUS,
  VRACK_URLS,
} from './vrack.constant';
import arrowIcon from '../../assets/icon_vrack-mapper-arrows.svg';

export default class VrackMoveDialogCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $rootScope,
    $state,
    $timeout,
    $translate,
    CucCloudMessage,
    OvhApiVrack,
    OvhApiMe,
    CucVrackService,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiVrack = OvhApiVrack;
    this.OvhApiMe = OvhApiMe;
    this.vrackService = CucVrackService;
  }

  $onInit() {
    this.poller = null;
    this.serviceName = null;
    this.name = null;
    this.description = null;
    this.nameEditing = false;
    this.descriptionEditing = false;
    this.nameOptions = { pattern: /^([a-zA-Z])\S*$/, maxLength: 100 };
    this.descriptionOptions = { maxLength: 255 };
    this.changeOwnerUrl = null;
    this.vRackCloudRoadmapGuide = null;
    this.arrowIcon = arrowIcon;

    this.modals = {
      move: null,
    };

    this.messages = [];

    this.loaders = {
      init: false,
      adding: false,
      deleting: false,
      moving: false,
    };

    this.data = {
      cloudProjects: [],
      allowedServices: {},
      vrackServices: {},
      pendingTasks: [],
    };

    this.form = {
      servicesToAdd: [],
      servicesToDelete: [],
      serviceToMove: null,
    };

    this.states = {
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

    this.groupedServiceKeys = {
      dedicatedCloudDatacenter: 'dedicatedCloud.niceName',
      managedBareMetalDatacenter: 'dedicatedCloud.niceName',
      dedicatedServerInterface: 'dedicatedServer.niceName',
    };

    this.loaders.init = true;
    this.loadMessage();
    if (isEmpty(this.$stateParams.vrackId)) {
      this.OvhApiVrack.v6()
        .query()
        .$promise.then((vracks) => {
          if (isEmpty(vracks)) {
            this.$state.go('vrack.add');
          } else {
            this.$state.go('vrack.dashboard', { vrackId: vracks[0] });
          }
        })
        .catch(() => {
          this.$state.go('vrack.add');
        });
    } else {
      // check if the serviceName is valid before loading the services
      this.OvhApiVrack.v6()
        .get({
          serviceName: this.$stateParams.vrackId,
        })
        .$promise.then((resp) => {
          this.serviceName = this.$stateParams.vrackId;
          this.name = resp.name;
          this.description = resp.description;
          this.setUserRelatedContent();
          this.refreshData();
        })
        .catch((err) => {
          this.CucCloudMessage.error(
            [
              this.$translate.instant('vrack_error'),
              (err.data && err.data.message) || '',
            ].join(' '),
          );
        });
    }

    this.$scope.$on('$destroy', () => {
      if (this.poller) {
        this.$timeout.cancel(this.poller);
      }
    });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('vrack');
    this.messageHandler = this.CucCloudMessage.subscribe('vrack', {
      onMessage: () => this.refreshMessage(),
    });
  }

  getDisplayName(serviceType) {
    return this.$translate.instant(
      `vrack_service_type_${serviceType.toLowerCase()}`,
    );
  }

  getAllowedServices() {
    return this.OvhApiVrack.Aapi()
      .allowedServices({ serviceName: this.serviceName })
      .$promise.then((allServicesParam) => {
        let allServices = {
          ...allServicesParam,
          dedicatedCloud: allServicesParam.dedicatedCloud.filter((service) => {
            return (
              VrackMoveDialogCtrl.isServiceAllowed(service) &&
              service.productReference === 'EPCC'
            );
          }),
          managedBareMetal: allServicesParam.dedicatedCloud.filter(
            (service) => {
              return (
                VrackMoveDialogCtrl.isServiceAllowed(service) &&
                service.productReference === 'MBM'
              );
            },
          ),
          dedicatedServer: allServicesParam.dedicatedServer.filter(
            VrackMoveDialogCtrl.isServiceAllowed,
          ),
          dedicatedServerInterface: allServicesParam.dedicatedServerInterface.filter(
            ({ dedicatedServer }) =>
              VrackMoveDialogCtrl.isServiceAllowed(dedicatedServer),
          ),
        };
        allServices = mapValues(allServices, (services, serviceType) => {
          if (isArray(services)) {
            return map(services, (service) =>
              this.constructor.fillServiceData(serviceType, service),
            );
          }
          return services;
        });

        // We need to append dedicatedServerInterfaces list to dedicatedServers list.
        if (
          has(allServices, 'dedicatedServerInterface') &&
          allServices.dedicatedServerInterface.length > 0
        ) {
          // If dedicatedServers list doesn't exist, we create it first.
          if (!has(allServices, 'dedicatedServer')) {
            allServices.dedicatedServer = [];
          }

          angular.forEach(
            allServices.dedicatedServerInterface,
            (serverInterface) => {
              allServices.dedicatedServer.push(serverInterface);
            },
          );

          allServices.dedicatedServerInterface = [];
        }

        return this.getAvailableServices(allServices);
      });
  }

  static isServiceAllowed(service) {
    return (
      !service.expired &&
      [STATUS.ok, STATUS.delivered].includes(service.state) &&
      service.status === STATUS.ok
    );
  }

  getAvailableServices(allServices) {
    return pickBy(allServices, (_, serviceType) => {
      return this.features.isFeatureAvailable(FEATURE_NAMES[serviceType]);
    });
  }

  getVrackServices() {
    return this.OvhApiVrack.Aapi()
      .services({ serviceName: this.serviceName })
      .$promise.then((allServicesParam) => {
        let allServices = allServicesParam;
        allServices = mapValues(allServices, (servicesParams, serviceType) => {
          let services = servicesParams;
          if (isArray(services)) {
            services = map(services, (service) =>
              this.constructor.fillServiceData(serviceType, service),
            );
          }
          return services;
        });

        if (has(allServices, 'dedicatedCloud')) {
          const groupedDedicatedCloud = groupBy(
            allServices.dedicatedCloud,
            (dedicatedCloud) => {
              return dedicatedCloud.productReference === 'MBM'
                ? 'managedBareMetal'
                : 'dedicatedCloud';
            },
          );
          allServices = assign(
            allServices,
            { dedicatedCloud: [] },
            groupedDedicatedCloud,
          );
        }
        if (has(allServices, 'dedicatedCloudDatacenter')) {
          let groupedDatacenters = groupBy(
            allServices.dedicatedCloudDatacenter,
            (datacenter) => {
              return get(datacenter, 'dedicatedCloud.productReference') ===
                'MBM'
                ? 'managedBareMetalDatacenter'
                : 'dedicatedCloudDatacenter';
            },
          );
          groupedDatacenters = mapValues(
            groupedDatacenters,
            (datacenters, type) => {
              return groupBy(
                datacenters,
                get(
                  this.groupedServiceKeys,
                  type,
                  this.groupedServiceKeys.dedicatedCloudDatacenter,
                ),
              );
            },
          );
          allServices = assign(
            allServices,
            { dedicatedCloudDatacenter: [] },
            groupedDatacenters,
          );
        }

        // We need to append dedicatedServerInterfaces list to dedicatedServers list.
        if (
          has(allServices, 'dedicatedServerInterface') &&
          allServices.dedicatedServerInterface.length > 0
        ) {
          // If dedicatedServers list doesn't exist, we create it first.
          if (!has(allServices, 'dedicatedServer')) {
            allServices.dedicatedServer = [];
          }

          angular.forEach(
            allServices.dedicatedServerInterface,
            (serverInterface) => {
              allServices.dedicatedServer.push(serverInterface);
            },
          );

          allServices.dedicatedServerInterface = [];
        }

        return this.getAvailableServices(allServices);
      });
  }

  getPendingTasks() {
    return this.OvhApiVrack.v6()
      .tasks({
        serviceName: this.serviceName,
      })
      .$promise.then((taskIds) =>
        this.$q
          .all(
            map(taskIds, (id) =>
              this.OvhApiVrack.v6()
                .task({
                  serviceName: this.serviceName,
                  taskId: id,
                })
                .$promise.then((task) => task)
                .catch((err) =>
                  err.status === 404 ? this.$q.when(null) : this.$q.reject(err),
                ),
            ),
          )
          .then((tasks) => without(tasks, null)),
      );
  }

  resetCache() {
    this.OvhApiVrack.v6().resetCache();
    this.OvhApiVrack.CloudProject()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.IpLoadBalancing()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.DedicatedCloud()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.DedicatedServer()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.DedicatedServerInterface()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.Ip()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.LegacyVrack()
      .v6()
      .resetQueryCache();
    this.OvhApiVrack.Aapi().resetAllCache();
  }

  moveDisplayedService(serviceId, allServicesSource, allServicesDestination) {
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
          // eslint-disable-next-line no-param-reassign
          allServicesSource[typeToMove] = groupBy(
            servicesToSearch,
            this.groupedServiceKeys[typeToMove],
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          allServicesSource[typeToMove] = servicesToSearch;
        }

        return false;
      }
      return null;
    });

    if (serviceToMove && typeToMove) {
      if (isGroupedServicesType) {
        const services = flatten(values(allServicesDestination[typeToMove]));
        services.push(serviceToMove[0]);
        // eslint-disable-next-line no-param-reassign
        allServicesDestination[typeToMove] = groupBy(
          services,
          this.groupedServiceKeys[typeToMove],
        );
      } else {
        allServicesDestination[typeToMove].push(serviceToMove[0]);
      }
    }
  }

  refreshData() {
    let poll = true;
    return this.getPendingTasks()
      .then((tasks) => {
        /**
         * First, we check if there is any new pending tasks ...
         */
        const currentTasks = map(tasks, 'id');
        const previousTasks = map(this.data.pendingTasks, 'id');
        if (
          difference(currentTasks, previousTasks).length ||
          difference(previousTasks, currentTasks).length
        ) {
          this.resetCache(); // a task changed, vrack state might have changed too
        } else if (tasks.length === 0) {
          poll = false; // no new tasks & no tasks, no need to poll
        }
        /**
         * Secondly, we fetch vrack data ...
         */
        return this.$q
          .all({
            allowedServices: this.getAllowedServices(),
            vrackServices: this.getVrackServices(),
          })
          .then((result) => {
            this.data.pendingTasks = tasks;
            this.data.allowedServices = result.allowedServices;
            this.data.vrackServices = result.vrackServices;

            /**
             * Finally, check if some tasks are adding or removing services in vrack
             * and move the service in his "future" column
             */
            angular.forEach(this.data.pendingTasks, (task) => {
              if (task && task.targetDomain) {
                const id = task.targetDomain;
                const fn = task.function;
                if (startsWith(fn, 'add')) {
                  this.moveDisplayedService(
                    id,
                    this.data.allowedServices,
                    this.data.vrackServices,
                  );
                } else if (startsWith(fn, 'remove')) {
                  this.moveDisplayedService(
                    id,
                    this.data.vrackServices,
                    this.data.allowedServices,
                  );
                }
                this.form.servicesToAdd = reject(this.form.servicesToAdd, {
                  id,
                });
                this.form.servicesToDelete = reject(
                  this.form.servicesToDelete,
                  { id },
                );
              }
            });
          });
      })
      .finally(() => {
        // if there are some pending tasks, poll
        if (poll && !this.poller) {
          this.poller = this.$timeout(() => {
            this.poller = null;
            this.refreshData();
          }, POLLING_INTERVAL);
        }
        this.loaders.init = false;
      });
  }

  isSelected(serviceType, serviceId) {
    return (
      angular.isDefined(
        find(this.form.servicesToAdd, {
          type: serviceType,
          id: serviceId,
        }),
      ) ||
      angular.isDefined(
        find(this.form.servicesToDelete, {
          type: serviceType,
          id: serviceId,
        }),
      ) ||
      isEqual(this.form.serviceToMove, { type: serviceType, id: serviceId })
    );
  }

  isPending(serviceId) {
    const ids = uniq(map(this.data.pendingTasks, 'targetDomain'));
    return ids.indexOf(serviceId) >= 0;
  }

  toggleAddService(serviceType, serviceId) {
    if (
      !this.isPending(serviceId) &&
      !this.loaders.adding &&
      !this.loaders.deleting
    ) {
      const toAdd = { type: serviceType, id: serviceId };
      if (find(this.form.servicesToAdd, toAdd)) {
        this.form.servicesToAdd = reject(this.form.servicesToAdd, toAdd);
      } else {
        this.form.servicesToAdd.push(toAdd);
      }
      this.form.serviceToMove = null;
      this.form.servicesToDelete = [];
    }
  }

  toggleDeleteService(serviceType, serviceId) {
    if (
      !this.isPending(serviceId) &&
      !this.loaders.adding &&
      !this.loaders.deleting
    ) {
      const toDelete = { type: serviceType, id: serviceId };
      if (find(this.form.servicesToDelete, toDelete)) {
        this.form.servicesToDelete = reject(
          this.form.servicesToDelete,
          toDelete,
        );
      } else {
        this.form.servicesToDelete.push(toDelete);
      }
      this.form.serviceToMove = null;
      this.form.servicesToAdd = [];
    }
  }

  toggleMoveService(serviceType, serviceId) {
    if (this.isPending(serviceId) || this.loaders.moving) {
      return;
    }
    const toMove = { type: serviceType, id: serviceId };
    if (this.form.serviceToMove === null) {
      this.form.servicesToAdd = [];
      this.form.servicesToDelete = [];
      this.form.serviceToMove = toMove;
    } else {
      this.form.serviceToMove = null;
    }
  }

  editName() {
    this.nameEditing = true;
    this.nameBackup = this.name;
  }

  cancelEditName() {
    this.nameEditing = false;
    this.name = this.nameBackup;
  }

  saveName() {
    this.nameEditing = false;

    this.OvhApiVrack.v6()
      .edit({ serviceName: this.serviceName }, { name: this.name })
      .$promise.then(() =>
        this.$rootScope.$broadcast('global_display_name_change', {
          serviceName: this.serviceName,
          displayName: this.name,
        }),
      )
      .catch((err) => {
        this.name = this.nameBackup;
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vrack_error'),
            (err.data && err.data.message) || err.message || '',
          ].join(' '),
        );
      })
      .finally(() => {
        this.nameBackup = null;
      });
  }

  editDescription() {
    this.descriptionEditing = true;
    this.descriptionBackup = this.description;
  }

  cancelEditDescription() {
    this.descriptionEditing = false;
    this.description = this.descriptionBackup;
  }

  saveDescription() {
    this.descriptionEditing = false;
    this.OvhApiVrack.v6()
      .edit(
        { serviceName: this.serviceName },
        { description: this.description },
      )
      .$promise.catch((err) => {
        this.description = this.descriptionBackup;
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vrack_error'),
            (err.data && err.data.message) || err.message || '',
          ].join(' '),
        );
      })
      .finally(() => {
        this.descriptionBackup = null;
      });
  }

  addSelectedServices() {
    this.loaders.adding = true;
    return this.$q
      .all(
        map(this.form.servicesToAdd, (service) => {
          let task = this.$q.reject('Unknown service type');
          switch (service.type) {
            case 'dedicatedServer':
              task = this.OvhApiVrack.DedicatedServer()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    dedicatedServer: service.id,
                  },
                ).$promise;
              break;
            case 'dedicatedServerInterface':
              task = this.OvhApiVrack.DedicatedServerInterface()
                .v6()
                .post(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    dedicatedServerInterface: service.id,
                  },
                ).$promise;
              break;
            case 'dedicatedCloud':
            case 'managedBareMetal':
              task = this.OvhApiVrack.DedicatedCloud()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    dedicatedCloud: service.id,
                  },
                ).$promise;
              break;
            case 'legacyVrack':
              task = this.OvhApiVrack.LegacyVrack()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    legacyVrack: service.id,
                  },
                ).$promise;
              break;
            case 'ip':
              task = this.OvhApiVrack.Ip()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    block: service.id,
                  },
                ).$promise;
              break;
            case 'cloudProject':
              task = this.OvhApiVrack.CloudProject()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    project: service.id,
                  },
                ).$promise;
              break;
            case 'ipLoadbalancing':
              task = this.OvhApiVrack.IpLoadBalancing()
                .v6()
                .create(
                  {
                    serviceName: this.serviceName,
                  },
                  {
                    ipLoadbalancing: service.id,
                  },
                ).$promise;
              break;
            default:
              break;
          }
          return task.catch((err) => {
            this.CucCloudMessage.error(
              [
                this.$translate.instant('vrack_add_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return this.$q.reject(err);
          });
        }),
      )
      .then(() => this.refreshData())
      .finally(() => {
        this.form.servicesToAdd = [];
        this.loaders.adding = false;
      });
  }

  deleteSelectedServices() {
    this.loaders.deleting = true;
    return this.$q
      .all(
        map(this.form.servicesToDelete, (service) => {
          let task = this.$q.reject('Unknown service type');
          switch (service.type) {
            case 'dedicatedServer':
              task = this.OvhApiVrack.DedicatedServer()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedServer: service.id,
                }).$promise;
              break;
            case 'dedicatedServerInterface':
              task = this.OvhApiVrack.DedicatedServerInterface()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedServerInterface: service.id,
                }).$promise;
              break;
            case 'dedicatedCloud':
            case 'managedBareMetal':
              task = this.OvhApiVrack.DedicatedCloud()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedCloud: service.id,
                }).$promise;
              break;
            case 'legacyVrack':
              task = this.OvhApiVrack.LegacyVrack()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  legacyVrack: service.id,
                }).$promise;
              break;
            case 'ip':
              task = this.OvhApiVrack.Ip()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  ip: service.id,
                }).$promise;
              break;
            case 'cloudProject':
              task = this.OvhApiVrack.CloudProject()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  project: service.id,
                }).$promise;
              break;
            case 'ipLoadbalancing':
              task = this.OvhApiVrack.IpLoadBalancing()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  ipLoadbalancing: service.id,
                }).$promise;
              break;
            default:
              break;
          }
          return task.catch((err) => {
            this.CucCloudMessage.error(
              [
                this.$translate.instant('vrack_remove_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return this.$q.reject(err);
          });
        }),
      )
      .then(() => this.refreshData())
      .finally(() => {
        this.form.servicesToDelete = [];
        this.loaders.deleting = false;
      });
  }

  moveSelectedService() {
    this.goToMoveDialog(
      merge(this.form.serviceToMove, { vrack: this.serviceName }),
    );
  }

  setAccordionState(side, kind, offset, value) {
    this.states.accordions[side][kind][offset] = value;
  }

  getAccordionState(side, kind, offset) {
    if (!has(this.states.accordions, [side, kind, offset])) {
      return true;
    }

    return this.states.accordions[side][kind][offset];
  }

  toggleAccordion(side, kind, offset) {
    this.states.accordions[side][kind][offset] = !this.states.accordions[side][
      kind
    ][offset];
  }

  isAdding() {
    return this.form.servicesToAdd.length > 0 && !this.loaders.adding;
  }

  isRemoving() {
    return this.form.servicesToDelete.length > 0 && !this.loaders.deleting;
  }

  isMoving() {
    return this.form.serviceToMove !== null && !this.loaders.moving;
  }

  static hasServices(services) {
    return keys(services).length > 0;
  }

  static getDedicatedServerNiceName(service) {
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

  static getDedicatedServerInterfaceNiceName(service) {
    const formattedService = VrackMoveDialogCtrl.getDedicatedServerNiceName(
      service.dedicatedServer,
    );
    formattedService.id = service.dedicatedServerInterface;
    formattedService.niceName = `${formattedService.niceName} - ${service.name}`;
    formattedService.trueServiceType = 'dedicatedServerInterface';
    return formattedService;
  }

  static getDedicatedCloudNiceName(service) {
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

  static getCloudProjectNiceName(service) {
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

  static getIpLoadbalancingNiceName(service) {
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

  static fillServiceData(serviceType, service) {
    let formattedService = null;
    switch (serviceType) {
      case 'dedicatedServer':
        formattedService = VrackMoveDialogCtrl.getDedicatedServerNiceName(
          service,
        );
        break;
      case 'dedicatedServerInterface':
        formattedService = VrackMoveDialogCtrl.getDedicatedServerInterfaceNiceName(
          service,
        );
        break;
      case 'dedicatedCloud':
      case 'managedBareMetal':
        formattedService = VrackMoveDialogCtrl.getDedicatedCloudNiceName(
          service,
        );
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
        formattedService = VrackMoveDialogCtrl.getCloudProjectNiceName(service);
        break;
      case 'ipLoadbalancing':
        formattedService = VrackMoveDialogCtrl.getIpLoadbalancingNiceName(
          service,
        );
        break;
      default:
        formattedService = cloneDeep(service);
        break;
    }
    return formattedService;
  }

  setUserRelatedContent() {
    this.OvhApiMe.v6()
      .get()
      .$promise.then((user) => {
        if (user.ovhSubsidiary === 'FR') {
          // Roadmap is only available in french
          this.vRackCloudRoadmapGuide = VRACK_URLS.guides.vrack.FR;
        }
        this.changeOwnerUrl = VRACK_URLS.changeOwner[user.ovhSubsidiary];
      });
  }
}
