import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
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
  SERVICE_FAMILIES_LIST,
  SERVICE_FAMILIES_MAP,
  STATUS,
  VRACK_DASHBOARD_TRACKING_PREFIX,
  VRACK_ACTIONS_SUFFIX,
  VRACK_URLS,
  SERVICE_FAMILIES_MAP_FETCH,
  serviceIconClassMapper,
  SERVICES_NAMES,
} from './vrack.constant.js';
import arrowIcon from '../../assets/icon_vrack-mapper-arrows.svg';

export default class VrackMoveDialogCtrl {
  /* @ngInject */
  constructor(
    $http,
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
    atInternet,
    coreConfig,
  ) {
    this.$http = $http;
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
    this.atInternet = atInternet;
    this.changeOwnerTrackLabel = `${VRACK_DASHBOARD_TRACKING_PREFIX}::change-owner`;
    this.SERVICE_FAMILIES_LIST = SERVICE_FAMILIES_LIST;
    this.SERVICES_NAMES = SERVICES_NAMES;
    this.serviceIconClassMapper = serviceIconClassMapper;
    this.coreConfig = coreConfig;
  }

  /**
   * @name filterAllowedServicesOnly
   * @description takes the object describing the services,
   * and returns the object after filtering each of them only for available services.
   * @param allServicesParam
   * @returns {*&{dedicatedCloud: *, dedicatedServer: T[], dedicatedServerInterface: {readonly dedicatedServer?: *}[], managedBareMetal: *}}
   */
  static filterAllowedServicesOnly(allServicesParam) {
    const allFamilies = Object.assign(allServicesParam, SERVICE_FAMILIES_MAP);

    return {
      ...allFamilies,
      dedicatedCloud: allServicesParam.dedicatedCloud.filter((service) => {
        return (
          VrackMoveDialogCtrl.isServiceAllowed(service) &&
          service.productReference === 'EPCC'
        );
      }),
      managedBareMetal: allServicesParam.dedicatedCloud.filter((service) => {
        return (
          VrackMoveDialogCtrl.isServiceAllowed(service) &&
          service.productReference === 'MBM'
        );
      }),
      dedicatedServer: allServicesParam.dedicatedServer.filter(
        VrackMoveDialogCtrl.isServiceAllowed,
      ),
      dedicatedServerInterface: allServicesParam.dedicatedServerInterface.filter(
        ({ dedicatedServer }) =>
          VrackMoveDialogCtrl.isServiceAllowed(dedicatedServer),
      ),
    };
  }

  static isServiceAllowed(service) {
    return (
      !service.expired &&
      [STATUS.ok, STATUS.delivered].includes(service.state) &&
      service.status === STATUS.ok
    );
  }

  static hasServices(services) {
    return keys(services).length > 0;
  }

  /**
   * make a niceName with the product description
   * @param service
   */
  static getOvhCloudConnectNiceName(service) {
    return {
      id: service.uuid,
      niceName: service.product,
      trueServiceType: SERVICES_NAMES['OVHCC_SERVICE'],
    };
  }

  static getDedicatedServerNiceName(service) {
    const formattedService = Object.create(service);
    formattedService.id = service.name;
    // by default the reverse seem to be equal to the name,
    // so do not display redundant information.
    if (service.reverse && service.reverse !== service.name) {
      formattedService.niceName = `${service.name} (${service.reverse})`;
    } else {
      formattedService.niceName = service.name;
    }
    formattedService.trueServiceType = SERVICES_NAMES['DEDICATED_SERVICE'];
    return formattedService;
  }

  static getDedicatedServerInterfaceNiceName(service) {
    const formattedService = VrackMoveDialogCtrl.getDedicatedServerNiceName(
      service.dedicatedServer,
    );
    formattedService.id = service[SERVICES_NAMES['DSI_SERVICE']];
    formattedService.niceName = `${formattedService.niceName} - ${service.name}`;
    formattedService.trueServiceType = SERVICES_NAMES['DSI_SERVICE'];

    return formattedService;
  }

  static getDedicatedCloudNiceName(service) {
    const formattedService = Object.create(service);
    formattedService.id = service.serviceName;
    if (service.description) {
      formattedService.niceName = `${service.serviceName} (${service.description})`;
    } else {
      formattedService.niceName = service.serviceName;
    }
    formattedService.trueServiceType = SERVICES_NAMES['DCLOUD_SERVICE'];
    return formattedService;
  }

  static getCloudProjectNiceName(service) {
    const formattedService = Object.create(service);
    formattedService.id = service.project_id;
    if (service.description) {
      formattedService.niceName = service.description;
    } else {
      formattedService.niceName = service.project_id;
    }
    formattedService.trueServiceType = SERVICES_NAMES['CP_SERVICE'];
    return formattedService;
  }

  static getIpLoadbalancingNiceName(service) {
    const formattedService = Object.create(service);
    formattedService.id = service.serviceName;
    if (service.displayName) {
      formattedService.niceName = service.displayName;
    } else {
      formattedService.niceName = service.serviceName;
    }
    formattedService.trueServiceType = SERVICES_NAMES['IPLB_SERVICE'];
    return formattedService;
  }

  static makeIpFormattedService(service) {
    return typeof service === 'string'
      ? {
          id: service,
          niceName: service,
          trueServiceType: SERVICES_NAMES['IP_SERVICE'],
        }
      : service;
  }

  static makeDedicatedCloudDatacenterService(service) {
    if (!service.datacenter) {
      // eslint-disable-next-line no-param-reassign
      service.datacenter = '';
    }
    // eslint-disable-next-line no-case-declarations
    const dedicatedCloudDatacenter = {};
    dedicatedCloudDatacenter.id = service.datacenter;
    dedicatedCloudDatacenter.niceName = last(service.datacenter.split('_'));
    if (isObject(service.dedicatedCloud)) {
      dedicatedCloudDatacenter.dedicatedCloud.niceName = `${service.dedicatedCloud.serviceName} (${service.dedicatedCloud.description})`;
    } else {
      dedicatedCloudDatacenter.dedicatedCloud = {
        niceName: service.dedicatedCloud,
      };
    }
    dedicatedCloudDatacenter.trueServiceType = SERVICES_NAMES['DCLOUDDC_SERVICE'];
    return dedicatedCloudDatacenter;
  }

  /**
   * @description Adds properties to move the services in and out of the vrack by finding an id,
   * niceName and a true service type.
   * @param serviceType
   * @param service
   * @returns {{trueServiceType, id: number, niceName: string}|any|{niceName}}
   */
  static fillServiceData(serviceType, service) {
    let formattedService = null;

    // foolproof for services if the filling is called more than once
    if (!service || service.length === 0) {
      return { id: 0, niceName: 'no name', trueServiceType: serviceType };
    }
    if (service.niceName) {
      return service;
    }

    switch (serviceType) {
      case SERVICES_NAMES['DEDICATED_SERVICE']:
        formattedService = VrackMoveDialogCtrl.getDedicatedServerNiceName(
          service,
        );
        break;
      case 'dedicatedServerInterface':
        formattedService = VrackMoveDialogCtrl.getDedicatedServerInterfaceNiceName(
          service,
        );

        break;
      case SERVICES_NAMES['DCLOUD_SERVICE']:
      case SERVICES_NAMES['MBM_SERVICE']:
        formattedService = VrackMoveDialogCtrl.getDedicatedCloudNiceName(
          service,
        );
        break;
      case SERVICES_NAMES['DCLOUDDC_SERVICE']:
        formattedService = this.makeDedicatedCloudDatacenterService(service);
        break;
      case SERVICES_NAMES['LVRACK_SERVICE']:
        formattedService = {
          id: service.id,
          niceName: service.niceName,
          trueServiceType: SERVICES_NAMES['LVRACK_SERVICE'],
        };
        break;
      case SERVICES_NAMES['IP_SERVICE']:
        formattedService = this.makeIpFormattedService(service);
        break;
      case SERVICES_NAMES['CP_SERVICE']:
        formattedService = VrackMoveDialogCtrl.getCloudProjectNiceName(service);
        break;
      case SERVICES_NAMES['OVHCC_SERVICE']:
        formattedService = VrackMoveDialogCtrl.getOvhCloudConnectNiceName(
          service,
        );
        break;
      case SERVICES_NAMES['IPLB_SERVICE']:
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

  $onInit() {
    this.poller = null;
    this.serviceName = null;
    this.name = null;
    this.description = null;
    this.nameEditing = false;
    this.descriptionEditing = false;
    this.nameOptions = { pattern: /^([a-zA-Z])\S*$/, maxLength: 100 };
    this.changeOwnerUrl = null;
    this.vRackCloudRoadmapGuide = null;
    this.arrowIcon = arrowIcon;

    this.modals = {
      move: null,
    };

    this.messages = [];

    this.loaders = {
      init: false,
      fetching: false,
      adding: false,
      deleting: false,
      moving: false,
      services: Object.create(SERVICE_FAMILIES_MAP_FETCH),
    };

    this.data = {
      cloudProjects: [],
      families: Object.create(SERVICE_FAMILIES_LIST),
      allowedServices: Object.create(SERVICE_FAMILIES_MAP),
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

  getAvailableServices(allServices) {
    return pickBy(allServices, (_, serviceType) => {
      return this.features.isFeatureAvailable(FEATURE_NAMES[serviceType]);
    });
  }

  /**
   * get the services already present in the selected vrack
   * @returns {*}
   */
  getVrackServices() {
    return this.OvhApiVrack.Aapi()
      .services({ serviceName: this.serviceName })
      .$promise.then((allServicesParam) => {
        let allServices = allServicesParam;
        allServices = mapValues(allServices, (servicesParams, serviceType) => {
          let services = servicesParams;
          if (Array.isArray(services) && services.length) {
            services = services.map((service) =>
              this.constructor.fillServiceData(serviceType, service),
            );
          }
          return services;
        });

        if (has(allServices, SERVICES_NAMES['DCLOUD_SERVICE'])) {
          const groupedDedicatedCloud = groupBy(
            allServices.dedicatedCloud,
            (dedicatedCloud) => {
              return dedicatedCloud.productReference === 'MBM'
                ? SERVICES_NAMES['MBM_SERVICE']
                : SERVICES_NAMES['DCLOUD_SERVICE'];
            },
          );
          allServices = assign(
            allServices,
            { dedicatedCloud: [] },
            groupedDedicatedCloud,
          );
        }
        if (has(allServices, SERVICES_NAMES['DCLOUDDC_SERVICE'])) {
          let groupedDatacenters = groupBy(
            allServices.dedicatedCloudDatacenter,
            (datacenter) => {
              return get(
                datacenter,
                `${SERVICES_NAMES['DCLOUD_SERVICE']}.productReference`,
              ) === 'MBM'
                ? SERVICES_NAMES['MBM_SERVICE']  : SERVICES_NAMES['DCLOUDDC_SERVICE'];
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
          if (!has(allServices, SERVICES_NAMES['DEDICATED_SERVICE'])) {
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
      const servicesToSearch = !Array.isArray(allServicesSource[type])
        ? flatten(values(allServicesSource[type]))
        : allServicesSource[type];

      serviceToMove = remove(servicesToSearch, (service) => {
        if (service.id === serviceId) {
          typeToMove = type;
          isGroupedServicesType = !Array.isArray(allServicesSource[type]);
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
    this.trackClick('add');
    this.loaders.adding = true;
    return this.$q
      .all(
        map(this.form.servicesToAdd, (service) => {
          let task = this.$q.reject('Unknown service type');
          switch (service.type) {
            case SERVICES_NAMES['DEDICATED_SERVICE']:
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
            case SERVICES_NAMES['DSI_SERVICE']:
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
            case SERVICES_NAMES['DCLOUD_SERVICE']:
            case SERVICES_NAMES['MBM_SERVICE']:
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
            case SERVICES_NAMES['LVRACK_SERVICE']:
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
            case SERVICES_NAMES['IP_SERVICE']:
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
            case SERVICES_NAMES['CP_SERVICE']:
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
            case SERVICES_NAMES['IPLB_SERVICE']:
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
    this.trackClick('remove');
    this.loaders.deleting = true;
    return this.$q
      .all(
        map(this.form.servicesToDelete, (service) => {
          let task = this.$q.reject('Unknown service type');
          switch (service.type) {
            case SERVICES_NAMES['DEDICATED_SERVICE']:
              task = this.OvhApiVrack.DedicatedServer()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedServer: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['DSI_SERVICE']:
              task = this.OvhApiVrack.DedicatedServerInterface()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedServerInterface: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['DCLOUD_SERVICE']:
            case SERVICES_NAMES['MBM_SERVICE']:
              task = this.OvhApiVrack.DedicatedCloud()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  dedicatedCloud: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['LVRACK_SERVICE']:
              task = this.OvhApiVrack.LegacyVrack()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  legacyVrack: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['IP_SERVICE']:
              task = this.OvhApiVrack.Ip()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  ip: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['CP_SERVICE']:
              task = this.OvhApiVrack.CloudProject()
                .v6()
                .delete({
                  serviceName: this.serviceName,
                  project: service.id,
                }).$promise;
              break;
            case SERVICES_NAMES['IPLB_SERVICE']:
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

  trackClick(hit, action = true) {
    this.atInternet.trackClick({
      name: `${VRACK_DASHBOARD_TRACKING_PREFIX}${
        action ? `::${VRACK_ACTIONS_SUFFIX}` : ''
      }::${hit}`,
      type: 'action',
    });
  }

  moveSelectedService() {
    this.trackClick('move');
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

  setUserRelatedContent() {
    const user = this.coreConfig.getUser();
    if (user.ovhSubsidiary === 'FR') {
      // Roadmap is only available in french
      this.vRackCloudRoadmapGuide = VRACK_URLS.guides.vrack.FR;
    }
    this.changeOwnerUrl = VRACK_URLS.changeOwner[user.ovhSubsidiary];
  }

  /**
   * get all families of services available to be added to a vrack
   * @returns {any}
   */
  getAllowedServices() {
    this.getAllowedServicesCounter = 0;

    /**
     * for each service, make a call and append the result to a literal object
     * this allows to see progressively the services for each families in the picker
     * and get rid of the timeout if there are too many services fetched at once
     */
    this.SERVICE_FAMILIES_LIST.forEach((serviceFamily) => {
      this.loaders.services[serviceFamily] = 'fetching';
      this.$http
        .get(
          `/vrack/${this.serviceName}/allowedServices?serviceFamily=${serviceFamily}`,
          {
            serviceType: 'aapi',
          },
        )
        .then((resp) => {
          const { data } = resp;
          this.handleOneServiceFamily(data, serviceFamily);
          this.getAllowedServicesCounter += 1;
          this.loaders.services[serviceFamily] = 'loaded';
        })
        .catch(() => {
          this.getAllowedServicesCounter += 1;
          this.loaders.services[serviceFamily] = 'error';
        });
    });

    return this.data.allowedServices;
  }

  /**
   * postmapping adds data in each family of service to have a consistent display in the template
   * @param allServices
   * @returns {*}
   */
  postMappingServices(allServices) {
    const mappedServices = Object.values(
      allServices,
    ).map((serviceList, serviceType) =>
      this.constructor.fillServiceData(serviceType, serviceList),
    );

    // We treat dedicatedServerInterfaces as dedicatedServers so we merge the lists as just one family: dedicatedServers.
    if (
      has(mappedServices, SERVICES_NAMES['DSI_SERVICE']) &&
      mappedServices.dedicatedServerInterface.length > 0
    ) {
      if (!mappedServices.dedicatedServer) {
        mappedServices.dedicatedServer = [];
      }
      allServices.dedicatedServerInterface.forEach((serverInterface) => {
        allServices.dedicatedServer.push(serverInterface);
      });
      mappedServices.dedicatedServerInterface = [];
    }

    return this.getAvailableServices(mappedServices);
  }

  /**
   * handleOneServiceFamily
   * @param serviceFetchedResponse
   * @param serviceFamily
   */
  handleOneServiceFamily(serviceFetchedResponse, serviceFamily) {
    const OneServiceData = serviceFetchedResponse[serviceFamily];
    this.loaders.services[serviceFamily] = true;
    /**
     * the vrack service will return undefined is there is no services for the given family.
     * each time a family is returned, we filter all the services and enrich the services list
     *  then filter only the allowed ones
     */
    if (!OneServiceData) {
      this.data.allowedServices[serviceFamily] = [];
      return;
    }

    if (Array.isArray(OneServiceData)) {
      // do not fill things in empty sets of services
      if (OneServiceData.length) {
        this.data.allowedServices[serviceFamily] = OneServiceData.map(
          (oneService) => {
            return VrackMoveDialogCtrl.fillServiceData(
              serviceFamily,
              oneService,
            );
          },
        );
      } else {
        this.data.allowedServices[serviceFamily] = [];
      }
    } else {
      this.data.allowedServices[serviceFamily] = OneServiceData;
    }

    if (this.data.allowedServices.dedicatedServerInterface) {
      this.data.allowedServices.dedicatedServerInterface.forEach((serv) => {
        this.data.allowedServices.dedicatedServer.push(serv);
      });
      this.data.allowedServices.dedicatedServerInterface = [];
    }
  }
}
