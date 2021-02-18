import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import indexOf from 'lodash/indexOf';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import map from 'lodash/map';
import pull from 'lodash/pull';
import set from 'lodash/set';
import some from 'lodash/some';
import tail from 'lodash/tail';
import uniq from 'lodash/uniq';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';

(() => {
  class CloudProjectComputeInfrastructureDiagramCtrl {
    constructor(
      $rootScope,
      $scope,
      $document,
      $filter,
      $q,
      $state,
      $stateParams,
      $timeout,
      $transitions,
      $translate,
      $uibModal,
      $window,
      CloudFlavorService,
      CucCloudMessage,
      CucCloudNavigation,
      CloudProjectComputeInfrastructureOrchestrator,
      CloudProjectComputeInfrastructureService,
      CloudProjectComputeVolumesOrchestrator,
      CloudProjectOrchestrator,
      CucUserPref,
      OvhApiCloud,
      OvhApiCloudProject,
      OvhApiCloudProjectFlavor,
      OvhApiCloudProjectImage,
      OvhApiCloudProjectNetworkPrivate,
      OvhApiCloudProjectRegion,
      OvhApiCloudProjectSnapshot,
      OvhApiCloudProjectSshKey,
      OvhApiCloudProjectVolumeSnapshot,
      OvhApiIp,
      OvhApiMe,
      jsPlumbService,
      Poller,
      CucRegionService,
      CLOUD_UNIT_CONVERSION,
      CLOUD_MONITORING,
      coreConfig,
      URLS,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$document = $document;
      this.$filter = $filter;
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$transitions = $transitions;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.$window = $window;

      this.CucCloudMessage = CucCloudMessage;
      this.CucCloudNavigation = CucCloudNavigation;
      this.CloudProjectComputeInfrastructureOrchestrator = CloudProjectComputeInfrastructureOrchestrator;
      this.InfrastructureService = CloudProjectComputeInfrastructureService;
      this.CloudProjectComputeVolumesOrchestrator = CloudProjectComputeVolumesOrchestrator;
      this.CloudProjectOrchestrator = CloudProjectOrchestrator;
      this.CucUserPref = CucUserPref;

      this.Cloud = OvhApiCloud;
      this.OvhApiCloudProject = OvhApiCloudProject;
      this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
      this.OvhApiCloudProjectImage = OvhApiCloudProjectImage;
      this.OvhApiCloudProjectNetworkPrivate = OvhApiCloudProjectNetworkPrivate;
      this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
      this.OvhApiCloudProjectSnapshot = OvhApiCloudProjectSnapshot;
      this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
      this.OvhApiCloudProjectVolumeSnapshot = OvhApiCloudProjectVolumeSnapshot;
      this.OvhApiIp = OvhApiIp;
      this.OvhApiMe = OvhApiMe;

      this.jsPlumbService = jsPlumbService;
      this.Poller = Poller;
      this.CucRegionService = CucRegionService;
      this.conversion = CLOUD_UNIT_CONVERSION;
      this.CLOUD_MONITORING = CLOUD_MONITORING;
      this.region = coreConfig.getRegion();
      this.URLS = URLS;
      this.CloudFlavorService = CloudFlavorService;

      this.SUPPORT_URL = buildURL('dedicated', '#/support;');
    }

    $onInit() {
      this.serviceName = null;
      this.sortInterval = null;

      this.CucCloudNavigation.init({
        state: 'iaas.pci-project.compute.infrastructure.diagram',
        stateParams: {
          serviceName: this.serviceName,
        },
      });

      this.collections = {
        privateNetworks: [],
      };
      this.errors = {
        init: false,
      };
      this.helpDisplay = {
        openUnlinkVolume: false,
      };
      this.openstackClientOpen = true;
      this.importedIpFailoverPending = []; // List of pending import ipFO
      this.infra = null;
      this.jsplumbInstance = null;
      this.loaders = {
        init: true,
        vRack: false,
        vlans: false,
        ips: false,
        volumes: false,
        jsPlumb: false,
        linkActionConfirm: false,
        volumeActionConfirm: false,
        privateNetworks: {
          query: false,
        },
      };
      this.model = {
        currentLinkEdit: null,
      };
      this.vlans = {
        vRackStatus: null,
      };
      this.regions = null;
      this.sort = {
        ipAutoSort: true,
        ipNaturalSort: true,
      };
      this.states = {
        sorting: false,
      };
      this.user = null;
      this.volumes = null;

      this.InfrastructureService.setPreferredView('diagram');

      // Hide cuc-highlighted-element on change state
      const hook = this.$transitions.onStart(
        { from: 'iaas.pci-project.compute.infrastructure.diagram' },
        () => {
          this.$rootScope.$broadcast('cuc-highlighted-element.hide');
        },
      );

      this.$scope.$on('$destroy', hook);

      this.$scope.$on(
        'compute.infrastructure.vm.status-update',
        (evt, newStatus, oldStatus, vm) => {
          if (oldStatus === 'BUILD' && newStatus === 'ACTIVE') {
            this.displayVmAuthInfo(vm);
          }
        },
      );

      this.$scope.$on('infra.refresh.links', () => {
        this.refreshLinks();
      });

      this.$scope.$on('infra.refresh.links.delayed', () => {
        // delay the execution, on VM deletion, VMS need to be moved before we refresh or links
        // aren't place properly
        this.$timeout(() => {
          this.refreshLinks();
        }, 1000);
      });

      this.initIpEdit();
      this.initVolumeEdit();

      // ------- jsPLUMB EVENTS -------

      this.initJsPlumb();

      // what to do when instance is created
      this.$scope.$on('jsplumb.instance.created', (evt, instance) => {
        this.jsplumbInstance = instance;
        window.JSPLUMBINSTANCE = this.jsplumbInstance;
      });

      // what to do when a connection is made
      this.$scope.$on(
        'jsplumb.instance.connection',
        (evt, connection, source, target, instance, originalEvent) => {
          const isVmSource = this.constructor.sourceIsVm(
            connection.source,
            connection.target,
          );
          const connectedIpId = isVmSource
            ? connection.targetId
            : connection.sourceId;
          const connectedVmId = isVmSource
            ? connection.sourceId
            : connection.targetId;
          const connectedIp = this.infra.internet.getIpById(connectedIpId);
          const connectedVm = this.infra.vrack.getVmById(connectedVmId);

          if (!connectedIp || !connectedVm) {
            return;
          }

          // Set connection style
          connection.setPaintStyle({
            strokeStyle: this.constructor.getLinkColor(connectedIp.type),
            lineWidth: 4,
          });
          connection.addClass(
            `_jsPlumb_connector_ip_${connectedIp.type || ''}`,
          );
          connection.addClass('fade-transition');

          // Don't up the size when hover ip public
          if (connectedIp.type === 'public') {
            connection.setHoverPaintStyle({ lineWidth: 4 });
          }

          // It's a connection drawn by the user (with its mouse)
          if (originalEvent) {
            const vmContinent = this.getVmContinent(connectedVm);
            const continentCode = get(connectedIp, 'continentCode');
            const isValidLink = vmContinent && vmContinent === continentCode;

            if (
              isValidLink &&
              (!this.model.currentLinkEdit ||
                this.model.currentLinkEdit.action === 'attach')
            ) {
              // set dotted line
              connection.setPaintStyle({
                strokeStyle: this.constructor.getLinkColor(connectedIp.type),
                lineWidth: 8,
                dashstyle: '2 1',
              });

              if (connectedIp.type === 'failover') {
                if (connectedIp.routedTo.length > 0) {
                  // It's a "move" : show a confirmation
                  const connectedVmCurrent = this.infra.vrack.getVmById(
                    connectedIp.routedTo[0],
                  );

                  set(this.model, 'currentLinkEdit', {
                    connection,
                    connectedIp,
                    connectedVm,
                    connectedVmCurrent,
                    action: 'attach',
                  });

                  this.$rootScope.$broadcast(
                    'cuc-highlighted-element.show',
                    `compute,${connectedIp.id},${connectedVmId}`,
                  );
                  this.model.currentLinkEdit.connection.addClass(
                    'cuc-highlighted-element cuc-highlighted-element-active',
                  );
                } else {
                  this.ipEdit.attach
                    .confirm(connectedVm, connectedIp)
                    .catch(() => {
                      this.jsplumbInstance.disconnectEndpoints(connection);
                    });
                }
              }
            } else {
              this.jsplumbInstance.disconnectEndpoints(connection);
            }
          }
        },
      );

      // ------- END jsPLUMB EVENTS -------

      // ------- JQUERY UI SORTABLE -------

      this.initSortable();

      // what to do when sort start
      this.$scope.$on('ui.sortable.start', () => {
        this.states.sorting = true;
        this.initInterval();
      });

      // what to do when sort stop
      this.$scope.$on('ui.sortable.stop', () => {
        this.states.sorting = false;
        if (this.sortInterval) {
          clearInterval(this.sortInterval);
          // redraw links for the last time and re-validate offset of non connected items
          this.redrawLinks(true);
        }
      });

      // what to do when position has changed
      this.$scope.$on('ui.sortable.update', (ngEvent, jqEvent, ui) => {
        const $sortedElem = $(ui.item);
        if ($sortedElem.hasClass('public-cloud-vm')) {
          // ------ TODO: warning: ASYNC call!!!!!!
          this.CloudProjectComputeInfrastructureOrchestrator.saveToUserPref();
        } else if ($sortedElem.hasClass('ip')) {
          // ------ TODO: warning: ASYNC call!!!!!!
          this.CloudProjectComputeInfrastructureOrchestrator.saveToUserPref();
        }
      });

      // Kill polling
      this.$scope.$on('$destroy', () => {
        this.CloudProjectComputeInfrastructureOrchestrator.killPollVms();
        this.CloudProjectComputeInfrastructureOrchestrator.killPollIps();
        this.CloudProjectComputeVolumesOrchestrator.killPollVolumes();
        this.Poller.kill({
          namespace: 'cloud.infra.ips.genericMoveFloatingIp',
        });
      });

      // ------- JQUERY UI DRAGGABLE -------

      this.initDraggable();

      this.$scope.$on('draggable.start', (event, obj) => {
        this.dragDropHelper.currentDraggedVolume = obj.draggable;
        this.dragDropHelper.draggingIsDoing = true;
        $('.tooltip').hide(); // force hide tooltip to avoid display bug when dragging
      });

      this.$scope.$on('draggable.stop', () => {
        if (!this.dragDropHelper.currentDroppableVmId) {
          this.dragDropHelper.currentDraggedVolume = null;
          this.refreshLinks();
        }
        this.dragDropHelper.draggingIsDoing = false;
      });

      // ------- JQUERY UI DROPPABLE -------

      this.initDroppable();

      this.$scope.$on('droppable.over', (event, obj) => {
        this.dragDropHelper.currentDroppableVmId = obj.droppable.droppableId;
        this.refreshLinks();
      });

      this.$scope.$on('droppable.out', () => {
        this.dragDropHelper.currentDroppableVmId = null;
        this.refreshLinks();
      });

      this.$scope.$on('droppable.drop', (event, obj) => {
        const srcVmId = get(
          this.dragDropHelper,
          'currentDraggedVolume.draggableInfo.srcVmId',
        );
        const targetVmId = obj.droppable.droppableId;

        if (srcVmId === 'unlinked') {
          // No Confirmation
          // Is not Volume factory !
          this.volumeEdit.volume = this.dragDropHelper.currentDraggedVolume.draggableInfo.volume;
          this.volumeEdit.targetVm = this.infra.vrack.getVmById(targetVmId);
          this.volumeEdit.move.confirm();
        } else {
          this.volumeEdit.move.launchConfirm(
            // Confirmation
            // Is not Volume factory !
            this.dragDropHelper.currentDraggedVolume.draggableInfo.volume,
            this.infra.vrack.getVmById(srcVmId),
            targetVmId !== 'unlinked'
              ? this.infra.vrack.getVmById(targetVmId)
              : null,
          );
        }
      });

      return this.init();
    }

    init() {
      this.loaders.init = true;
      this.initDragDropHelper();

      // Get type of project
      this.getProjectContext();

      this.getUser();
      // @todo: reset cache

      // Pre-load required data (all this data will be cached)
      return this.$q
        .all([
          this.OvhApiCloudProjectRegion.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.OvhApiCloudProjectImage.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.OvhApiCloudProjectSnapshot.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.OvhApiCloudProjectFlavor.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.OvhApiCloudProjectSshKey.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.OvhApiCloudProjectVolumeSnapshot.v6().query({
            serviceName: this.serviceName,
          }).$promise,
          this.initRegions(this.serviceName),
        ])
        .then(() => this.initInfra())
        .catch(() => {
          this.errors.init = true;
        })
        .finally(() => {
          this.loaders.init = false;
        });
    }

    initDragDropHelper() {
      this.dragDropHelper = {
        draggingIsDoing: false,
        currentDraggedVolume: null,
        currentDroppableVmId: null,
      };
    }

    getProjectContext() {
      this.serviceName = this.$stateParams.projectId;
      this.instanceId = this.$stateParams.projectId;
    }

    getUser() {
      return this.OvhApiMe.v6()
        .get()
        .$promise.then((user) => {
          this.user = user;
        });
    }

    /**
     * Fetch all the regions
     * @param {string} serviceName
     */
    initRegions(serviceName) {
      return this.OvhApiCloudProjectRegion.v6()
        .query({ serviceName })
        .$promise.then((regionIds) =>
          this.initRegionFromIds(serviceName, regionIds),
        );
    }

    /**
     * Build the list of GET region calls from region ids list
     * @param {string} serviceName
     * @param {array} regionIds
     */
    initRegionFromIds(serviceName, regionIds) {
      const getRegions = map(
        regionIds,
        (regionId) =>
          this.OvhApiCloudProjectRegion.v6().get({
            serviceName,
            id: regionId,
          }).$promise,
      );
      return this.$q.all(getRegions).then((result) => {
        this.regions = result;
      });
    }

    initInfra() {
      const initInfraQueue = [];
      const { serviceName } = this;

      this.loaders.vRack = true;
      this.loaders.ips = true;
      this.loaders.jsPlumb = true;
      this.loaders.vlans = true;
      this.loaders.volumes = true;
      this.errors.init = false;

      this.importedIpFailoverPending = [];

      // Init jsPlumb
      initInfraQueue.push(
        this.jsPlumbService.jsplumbInit().finally(() => {
          this.loaders.jsPlumb = false;
          this.jsPlumbService.importDefaults({
            MaxConnections: -1,
          });
        }),
      );

      // Init Infra
      initInfraQueue.push(
        this.CloudProjectOrchestrator.initInfrastructure({ serviceName })
          .then((infra) => {
            this.infra = infra;
            forOwn(this.infra.vrack.publicCloud.items, (value) => {
              const instanceFlavor = value.flavor;
              instanceFlavor.formattedName = this.CloudFlavorService.formatFlavorName(
                instanceFlavor.name,
              );
            });

            // check if there are IPFO import to poll
            this.checkPendingImportIpFailOver(serviceName);

            // check if IPs auto sort is enabled
            this.checkIpAutoSort(serviceName);
          })
          .then(() =>
            this.updateReverseDns(this.infra.internet.ipList.getItems()),
          )
          .then(() =>
            this.shouldDisplayInstancesRetracted().then((retracted) => {
              if (retracted) {
                this.CloudProjectComputeInfrastructureOrchestrator.collapseAllVm();
              }
            }),
          )
          .then(() => this.initVlan()),
      );

      // Init Volumes
      initInfraQueue.push(
        this.CloudProjectOrchestrator.initVolumes({ serviceName }).then(
          (volumes) => {
            this.volumes = get(volumes, 'volumes');
          },
        ),
      );

      return this.$q
        .all(initInfraQueue)
        .catch(() => {
          this.errors.init = true;
        })
        .finally(() => {
          this.loaders.vRack = false;
          this.loaders.ips = false;
          this.loaders.volumes = false;

          if (this.$stateParams.openVncWithId) {
            this.openVncWithId(this.$stateParams.openVncWithId);
          }

          if (this.$stateParams.createNewVm) {
            this.addVirtualMachine();
          } else if (this.$stateParams.createNewVolume) {
            // check if we need to display the volume creation popup
            this.addVolume();
          } else if (this.$stateParams.createNewVolumeFromSnapshot.snapshot) {
            this.addVolumeFromSnapshot(
              this.$stateParams.createNewVolumeFromSnapshot.snapshot,
            );
          } else if (
            isString(this.$stateParams.editVm) &&
            !isEmpty(this.$stateParams.editVm)
          ) {
            this.toggleVmEditionState(
              this.infra.vrack.publicCloud.items[this.$stateParams.editVm],
            );
          } else if (
            isString(this.$stateParams.monitorVm) &&
            !isEmpty(this.$stateParams.monitorVm)
          ) {
            this.openVmMonitoringPanel(
              this.infra.vrack.publicCloud.items[this.$stateParams.monitorVm],
            );
          }

          if (this.CLOUD_MONITORING.alertingEnabled) {
            // Monitoring loading must begin at the end
            this.CloudProjectComputeInfrastructureOrchestrator.loadVmMonitoringData();
          }
        });
    }

    initVlan() {
      return this.CloudProjectComputeInfrastructureOrchestrator.hasVrack()
        .then((hasVrack) => {
          set(this.vlans, 'vRackStatus', hasVrack ? 'activated' : 'none');
        })
        .finally(() => {
          this.loaders.vlans = false;
        });
    }

    // ------- END INIT -------

    /**
     * At init, check if there are IPFO importation to poll
     * @param {string} serviceName
     */
    checkPendingImportIpFailOver(serviceName) {
      // On page refresh, get pending IPFO import
      return this.CucUserPref.get(
        `cloud_project_${serviceName}_infra_ipfo_import`,
      ).then((ipfoToImportParam) => {
        let ipfoToImport = ipfoToImportParam;
        ipfoToImport = get(ipfoToImport, 'ips', []);
        if (isArray(ipfoToImport) && ipfoToImport.length > 0) {
          forEach(ipfoToImport, (ipfo) => {
            this.pollImportIpFailOver(serviceName, ipfo);
          });
        }
      });
    }

    /**
     * Poll a given IPFO address
     * @param {string} serviceName
     * @param {string} ip the ip object
     * @param taskObj (optional) task to poll
     */
    pollImportIpFailOver(serviceName, ip, taskObj = null) {
      // Already polling
      if (~this.importedIpFailoverPending.indexOf(ip)) {
        return;
      }

      const taskToPoll = taskObj
        ? taskObj.taskId
        : this.OvhApiIp.v6().getPendingTask(ip, 'genericMoveFloatingIp');

      this.$q
        .when(taskToPoll)
        .then((taskId) => {
          if (taskId) {
            this.importedIpFailoverPending.push(ip);

            this.CucUserPref.set(
              `cloud_project_${serviceName}_infra_ipfo_import`,
              {
                ips: this.importedIpFailoverPending,
              },
            );

            return this.Poller.poll(
              `/ip/${encodeURIComponent(ip)}/task/${taskId}`,
              null,
              {
                namespace: 'cloud.infra.ips.genericMoveFloatingIp',
              },
            )
              .then(() => {
                // On success: the IP should be in the /cloud/.../ip/failover list.
                this.CloudProjectComputeInfrastructureOrchestrator.pollIps(
                  'failover',
                );
                this.CucCloudMessage.success(
                  this.$translate.instant('cpci_ipfo_import_success', { ip }),
                );
              })
              .catch((err) => {
                if (err && err.status) {
                  // On error: remove the IP from list
                  this.CucCloudMessage.error(
                    this.$translate.instant('cpci_ipfo_import_error', { ip }),
                  );
                }
              });
          }
          return null;
        })
        .then(() => {
          pull(this.importedIpFailoverPending, ip);
          this.CucUserPref.set(
            `cloud_project_${serviceName}_infra_ipfo_import`,
            {
              ips: this.importedIpFailoverPending,
            },
          );
        })
        .finally(() => {
          this.refreshLinks();
        });
    }

    /**
     * Check in local storage if IPs auto sort is enabled
     * @param {string} serviceName
     */
    checkIpAutoSort(serviceName) {
      this.CucUserPref.get(
        `cloud_project_${serviceName}_infra_ip_autosort`,
      ).then((ipAutoSort) => {
        if (ipAutoSort) {
          this.sort.ipAutoSort = ipAutoSort.enabled;
          // activate naturalSort if autoSort is enabled
          this.sort.ipNaturalSort = ipAutoSort.enabled;
          this.refreshLinks();
        }
      });
    }

    /**
     * Updates reverse dns of given ips.
     */
    updateReverseDns(ips) {
      const reverseQueue = map(
        ips,
        (ip) =>
          this.OvhApiIp.Reverse()
            .v6()
            .getReverseDns(ip.ip, ip.block)
            .then((dns) => {
              set(ip, 'reverse', dns);
            })
            .catch(() => this.$q.when(null)),
        // ok we choose to ignore errors here, so the application can still be used,
        // instead of displaying an ugly error message just because one reverse dns call failed
        // let's assume the reverse dns is just null);
      );
      return this.$q.all(reverseQueue);
    }

    shouldDisplayInstancesRetracted() {
      return this.$q
        .all({
          hasTooManyInstances: this.CloudProjectOrchestrator.hasTooManyInstances(
            this.$stateParams.projectId,
          ),
          hasTooManyIps: this.CloudProjectOrchestrator.hasTooManyIps(
            this.$stateParams.projectId,
          ),
        })
        .then((result) => result.hasTooManyInstances || result.hasTooManyIps);
    }

    refreshLinks() {
      this.$timeout(() => {
        if (this.jsplumbInstance) {
          this.jsplumbInstance.revalidateEverything();
        }
      }, 99);
    }

    openVncWithId(vmId) {
      const completeVm = this.infra.vrack.publicCloud.get(vmId);
      if (completeVm) {
        this.InfrastructureService.openVnc(completeVm);
      }
    }

    addVolume() {
      this.refreshLinks();
      this.helpDisplay.openUnlinkVolume = true;
      this.CloudProjectComputeVolumesOrchestrator.addNewVolumeToList(
        'unlinked',
      ).then((volumeDraft) => {
        this.CloudProjectComputeVolumesOrchestrator.turnOnVolumeEdition(
          volumeDraft,
        );
      });
    }

    addVolumeFromSnapshot(snapshot) {
      this.refreshLinks();
      this.helpDisplay.openUnlinkVolume = true;
      this.CloudProjectComputeVolumesOrchestrator.addNewVolumeFromSnapshotToList(
        'unlinked',
        snapshot,
      )
        .then((volumeDraft) => {
          this.CloudProjectComputeVolumesOrchestrator.turnOnVolumeEdition(
            volumeDraft,
          );
        })
        .catch((err) => {
          this.CucCloudMessage.error(
            `${this.$translate.instant(
              'cpci_volume_add_from_snapshot_error',
            )} ${get(err, 'data.message', '')}`,
          );
        });
    }

    addVirtualMachine() {
      this.CloudProjectComputeInfrastructureOrchestrator.addNewVmToList().then(
        (vm) => {
          this.CloudProjectComputeInfrastructureOrchestrator.turnOnVmEdition(
            vm,
          );
        },
      );
    }

    // ------- REGION ACTIONS -------

    getVmContinent(vm) {
      const region = find(this.regions, { name: vm.region });
      return get(region, 'continentCode', undefined);
    }

    // ------- END REGION -------

    // ------- VM ACTIONS -------

    deleteConfirmPending(vm) {
      // We display a popover warning in two cases :
      //  - the vm is in monthly billing
      //  - the vm is routed to failOver IPs
      if (vm.monthlyBilling && vm.monthlyBilling.status === 'ok') {
        this.$uibModal
          .open({
            windowTopClass: 'cui-modal',
            templateUrl:
              'app/cloud/project/compute/infrastructure/virtualMachine/delete/cloud-project-compute-infrastructure-virtual-machine-delete.html',
            controller:
              'CloudprojectcomputeinfrastructurevirtualmachinedeleteCtrl',
            controllerAs: '$ctrl',
            resolve: {
              params: () => vm,
            },
          })
          .result.then(() => {
            this.deleteVirtualMachine(vm);
          });
      } else {
        this.InfrastructureService.deleteVirtualMachine(vm);
      }
    }

    deleteVirtualMachine(vm) {
      set(vm, 'confirmLoading', true);
      this.CloudProjectComputeInfrastructureOrchestrator.deleteVm(vm)
        .catch((err) => {
          this.CucCloudMessage.error(
            `${this.$translate.instant('cpci_vm_delete_submit_error')} ${get(
              err,
              'data.message',
              '',
            )}`,
          );
        })
        .finally(() => {
          set(vm, 'confirmLoading', false);
        });
    }

    openVolumeSnapshotWizard(volume) {
      this.$uibModal.open({
        templateUrl:
          'app/cloud/project/compute/volume/snapshot/cloud-project-compute-volume-snapshot-add.html',
        controller: 'CloudProjectComputeVolumeSnapshotAddCtrl',
        controllerAs: 'CloudProjectComputeVolumeSnapshotAddCtrl',
        resolve: {
          params: () => volume,
        },
      });
    }

    // ------- END VM -------

    // ------- VM DISPLAY TOOLS -------

    toggleVmEditionState(vm, param) {
      if (vm.openDetail) {
        this.CloudProjectComputeInfrastructureOrchestrator.turnOffVmEdition(
          true,
        );
        this.$rootScope.$broadcast('cuc-highlighted-element.hide');
      } else {
        if (param) {
          this.CloudProjectComputeInfrastructureOrchestrator.setEditVmParam(
            param,
          );
        }
        this.CloudProjectComputeInfrastructureOrchestrator.turnOnVmEdition(vm);
      }
    }

    openVmMonitoringPanel(vm) {
      this.CloudProjectComputeInfrastructureOrchestrator.openMonitoringPanel(
        vm,
      );
    }

    displayVmAuthInfo(vm) {
      const completeVm = this.infra.vrack.publicCloud.get(vm.id);
      this.InfrastructureService.openLoginInformations(completeVm);
    }

    collapseAll() {
      this.CloudProjectComputeInfrastructureOrchestrator.collapseAllVm();
      this.refreshLinks();
    }

    unCollapseAll() {
      this.CloudProjectComputeInfrastructureOrchestrator.uncollapseAllVm();
      this.refreshLinks();
    }

    toggleCollapsedState(vm) {
      this.CloudProjectComputeInfrastructureOrchestrator.toggleVmCollapsedState(
        vm,
      );
      this.refreshLinks();
    }

    toggleCollapsedVolumes(vm) {
      if (vm) {
        this.CloudProjectComputeInfrastructureOrchestrator.toggleCollapsedVolumes(
          vm,
        );
      } else {
        this.helpDisplay.openUnlinkVolume = !this.helpDisplay.openUnlinkVolume;
      }
      this.refreshLinks();
      if (!vm && (!this.volumes.unlinked || !this.volumes.unlinked.length)) {
        this.addVolume();
      }
    }

    // ------- END VM DISPLAY TOOLS -------

    // ------- IPS ACTIONS -------

    importIpFailover() {
      this.InfrastructureService.importIpFailOver(
        this.importedIpFailoverPending,
      ).then((listTasksListIpsWithTasks) => {
        // Launch polling
        forEach(listTasksListIpsWithTasks, (ipWithTask) => {
          this.pollImportIpFailOver(
            this.$stateParams.projectId,
            ipWithTask.ip,
            ipWithTask.task,
          );
        });
        this.refreshLinks();
      });
    }

    /**
     * Toggle automatic sorting of ips
     */
    toggleIpSort() {
      const autoSortEnable = !this.sort.ipAutoSort;
      this.sort.ipAutoSort = autoSortEnable;
      this.sort.ipNaturalSort = autoSortEnable; // activate naturalSort if autoSort is enabled
      this.refreshLinks();
      this.CucUserPref.set(
        `cloud_project_${this.$stateParams.projectId}_infra_ip_autosort`,
        {
          enabled: autoSortEnable,
        },
      );
    }

    /**
     * Sort the ip in order to have the least crossing between links
     */
    ipAutoSort() {
      const ipAutoSort = get(this.sort, 'ipAutoSort', false);
      const ipListSortedKeys = get(
        this.infra,
        'internet.ipList.sortedKeys',
        [],
      );
      const publicCloudSortedKeys = get(
        this.infra,
        'vrack.publicCloud.sortedKeys',
        [],
      );

      return (ip) => {
        // only if autoSort is enabled ...
        if (!ipAutoSort) {
          return indexOf(ipListSortedKeys, ip.id);
        }
        let order = 0;
        let routeCount = 0;
        forEach(ip.routedTo, (route) => {
          const vmPosition = indexOf(publicCloudSortedKeys, route);
          if (vmPosition !== -1) {
            order += vmPosition * 5; // arbitrary weight of 5 for a link with a vm
            routeCount += 1;
          }
        });

        if (routeCount > 0) {
          order /= routeCount; // compute our position with average order
          if (ip.type === 'failover') {
            order += 1;
          }
          return order;
        }

        return Number.MAX_VALUE; // goes to the bottom
      };
    }

    /**
     * Sort IPs in their natural order
     */
    ipSortNatural() {
      const ipNaturalSort = get(this.sort, 'ipNaturalSort', false);
      const ipListSortedKeys = get(
        this.infra,
        'internet.ipList.sortedKeys',
        [],
      );

      return (ip) => {
        // only if natural sort is activated ...
        if (!ipNaturalSort) {
          return indexOf(ipListSortedKeys, ip.id);
        }

        const ipRegex = new RegExp(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
        if (ip && ipRegex.test(ip.ip)) {
          // IPv4 ...
          const values = ipRegex.exec(ip.ip);
          let score = 0;
          score += parseInt(values[1], 10) * 1000000000;
          score += parseInt(values[2], 10) * 1000000;
          score += parseInt(values[3], 10) * 1000;
          score += parseInt(values[4], 10);
          return score;
        }
        return ip.ip;
      };
    }

    ipReverse(ip) {
      return this.$translate.instant('cloud_public_ip_failover_reverse', {
        ip: ip.reverse,
      });
    }

    // ------- END IPS  -------

    // ******* jsPLUMB *******

    // ------- jsPLUMB TOOLS -------

    static sourceIsVm(source, target) {
      return $(source).hasClass('vm-port') && $(target).hasClass('ip-port');
    }

    static getLinkColor(type) {
      const defaultColor = '#a8e0d5';
      switch (type) {
        case 'disabled':
          return '#bbdcd5';
        case 'public':
          return '#444444';
        case 'failover':
          return defaultColor;
        default:
          return defaultColor;
      }
    }

    redrawLinks(reValidateEmptyEndpoints) {
      if (this.jsplumbInstance) {
        this.jsplumbInstance.repaintEverything(reValidateEmptyEndpoints);
      }
    }

    // ------- JSPLUMB CONF -------

    initJsPlumb() {
      // Default options
      this.srcDrawOptionsBase = {
        connector: ['Bezier', { curviness: 100 }],
        connectorStyle: {
          strokeStyle: this.constructor.getLinkColor(),
          lineWidth: 4,
        },
      };

      // ------- JSPLUMB VM FUNCTION CONF -------
      this.vmSourceDrawOptions = {
        connector: this.srcDrawOptionsBase.connector,
        connectorStyle: this.srcDrawOptionsBase.connectorStyle,
        anchor: [0.5, 0.5, 1, 0],
        endpoint: ['Blank', { cssClass: 'vm-source' }],
        filter: '.port-inner',
        dragOptions: {
          start: () => {
            const id = $(this).attr('elid');
            const vm = this.infra.vrack.getVmById(id);
            if (vm) {
              this.$rootScope.$broadcast(
                'cuc-highlighted-element.show',
                `compute,${vm.id},ip-failover-ok-${this.getVmContinent(vm)}`,
              );
            }
          },
          stop: () => {
            const id = $(this).attr('elid');
            const vm = this.infra.vrack.getVmById(id);
            if (vm) {
              this.$rootScope.$broadcast(
                'cuc-highlighted-element.hide',
                `compute,${vm.id},ip-failover-ok-${this.getVmContinent(vm)}`,
              );
            }
          },
        },
      };

      // ------- jsPLUMB VM FUNCTION CONF -------
      this.vmTargetDrawOptions = {
        anchor: [0.5, 0.5, 1, 0],
        endpoint: ['Blank', { cssClass: 'vm-target' }],
        dropOptions: {
          accept: '.ip-source',
          hoverClass: 'hover-port',
        },
      };

      // ------- jsPLUMB IP FUNCTION CONF -------
      this.ipTargetDrawOptions = {
        anchor: [0.5, 0.5, -1, 0],
        endpoint: ['Blank', { cssClass: 'ip-target' }],
        dropOptions: {
          accept: '.vm-source',
          hoverClass: 'hover-port',
        },
      };

      this.ipSourceDrawOptions = {
        connector: this.srcDrawOptionsBase.connector,
        connectorStyle: this.srcDrawOptionsBase.connectorStyle,
        connectorHoverStyle: this.srcDrawOptionsBase.connectorHoverStyle,
        // anchor: "LeftMiddle",
        anchor: [0.5, 0.5, -1, 0],
        endpoint: ['Blank', { cssClass: 'ip-source' }],
        filter: '.port-inner',
        dragOptions: {
          start: () => {
            const id = $(this).attr('elid');
            const ip = this.infra.internet.getIpById(id);
            if (ip) {
              this.$rootScope.$broadcast(
                'cuc-highlighted-element.show',
                `compute,${get(ip, 'id', '')},vm-ACTIVE-${get(
                  ip,
                  'continentCode',
                  '',
                )}`,
              );
            }
          },
          stop: () => {
            const id = $(this).attr('elid');
            const ip = this.infra.internet.getIpById(id);
            if (ip) {
              this.$rootScope.$broadcast(
                'cuc-highlighted-element.hide',
                `compute,${get(ip, 'id', '')},vm-ACTIVE-${get(
                  ip,
                  'continentCode',
                  '',
                )}`,
              );
            }
          },
        },
      };
    }

    // ******* END jsPLUMB *******

    initIpEdit() {
      this.ipEdit = {
        attach: {
          confirm: (vm, ip) => {
            if (!this.loaders.linkActionConfirm) {
              const connectedVm = vm || this.model.currentLinkEdit.connectedVm;
              const connectedIp = ip || this.model.currentLinkEdit.connectedIp;

              this.loaders.linkActionConfirm = true;

              return this.CloudProjectComputeInfrastructureOrchestrator.attachIptoVm(
                connectedIp,
                connectedVm,
              )
                .then(() => {
                  this.$rootScope.$broadcast('cuc-highlighted-element.hide');
                  this.model.currentLinkEdit = null;
                  let successMessage = {
                    text: this.$translate.instant('cpci_ip_attach_success', {
                      ip: connectedIp.ip,
                      instance: connectedVm.name,
                    }),
                  };
                  if (connectedIp.type === 'failover' && connectedVm.image) {
                    const distribution =
                      connectedVm.image.distribution ||
                      this.URLS.guides.ip_failover.defaultDistribution;
                    successMessage = {
                      textHtml: `${
                        successMessage.text
                      } ${this.$translate.instant(
                        'cpci_ip_attach_failover_help',
                        {
                          link: this.URLS.guides.ip_failover[
                            this.user.ovhSubsidiary
                          ][distribution],
                        },
                      )}`,
                    };
                  }
                  this.CucCloudMessage.success(successMessage);
                })
                .catch((err) => {
                  this.CucCloudMessage.error(
                    `${this.$translate.instant('cpci_ip_attach_error', {
                      ip: connectedIp.ip,
                      instance: connectedVm.name,
                    })} ${get(err, 'data.message', '')}`,
                  );
                  return this.$q.reject(err);
                })
                .finally(() => {
                  this.loaders.linkActionConfirm = false;
                });
            }
            return null;
          },
          cancel: () => {
            if (!this.loaders.linkActionConfirm && this.model.currentLinkEdit) {
              // if user drawn a line: delete it
              if (this.model.currentLinkEdit.connection) {
                this.jsplumbInstance.disconnectEndpoints(
                  this.model.currentLinkEdit.connection,
                );
              }

              // for manual attach
              if (this.model.currentLinkEdit.connectionCurrent) {
                // this.model.currentLinkEdit.connectionCurrent
                //   .setHoverPaintStyle({ lineWidth : 8 });
                this.model.currentLinkEdit.connectionCurrent.removeClass(
                  'cuc-highlighted-element cuc-highlighted-element-active',
                );
              }

              this.$rootScope.$broadcast('cuc-highlighted-element.hide');
              this.model.currentLinkEdit = null;
            }
          },
          button: (ip) => {
            // input radio
            if (ip.type === 'failover') {
              // list of compatible(s) vm(s) to attach the ip
              const compatibleVms = filter(
                this.infra.vrack.publicCloud.items,
                (vm) => this.ipEdit.attach.canAttachIpToVm(ip, vm),
              );

              // do we have at least one compatible vm?
              if (isArray(compatibleVms) && compatibleVms.length > 0) {
                set(this.model, 'currentLinkEdit', {
                  connectionCurrentVmId:
                    ip.routedTo.length > 0 ? ip.routedTo[0] : null,
                  connectionVmId:
                    ip.routedTo.length > 0 ? ip.routedTo[0] : null,

                  connectionCurrent:
                    ip.routedTo.length > 0
                      ? this.jsplumbInstance.getConnectionBySourceIdAndTargetId(
                          ip.id,
                          ip.routedTo[0],
                        )
                      : null,
                  connection: null,

                  connectedIp: ip,
                  connectedVmCurrent:
                    ip.routedTo.length > 0
                      ? this.infra.vrack.getVmById(ip.routedTo[0])
                      : null,
                  action: 'attach',
                  isManual: true,
                });

                // If there are a connection already, highlight it
                if (this.model.currentLinkEdit.connectionCurrent) {
                  this.model.currentLinkEdit.connectionCurrent.setHoverPaintStyle(
                    { lineWidth: 4 },
                  );
                  this.model.currentLinkEdit.connectionCurrent.addClass(
                    'cuc-highlighted-element cuc-highlighted-element-active',
                  );
                }

                this.$rootScope.$broadcast(
                  'cuc-highlighted-element.show',
                  `compute,vm-ACTIVE-${get(
                    this.model,
                    'currentLinkEdit.connectedIp.continentCode',
                    '',
                  )}`,
                );
              } else {
                this.CucCloudMessage.error(
                  this.$translate.instant('cpci_ipfo_attach_error'),
                );
              }
            }
          },
          changeRadioConnection: () => {
            // If there are already a link: detach it
            if (this.model.currentLinkEdit.connection) {
              this.jsplumbInstance.disconnectEndpoints(
                this.model.currentLinkEdit.connection,
              );
              this.model.currentLinkEdit.connection = null;
              this.model.currentLinkEdit.connectedVm = null;
            }

            if (
              this.model.currentLinkEdit.connectionCurrentVmId !==
              this.model.currentLinkEdit.connectionVmId
            ) {
              // create connection
              this.model.currentLinkEdit.connection = this.jsplumbInstance.connectEndpoints(
                this.model.currentLinkEdit.connectedIp.id,
                this.model.currentLinkEdit.connectionVmId,
              );
              this.model.currentLinkEdit.connectedVm = this.infra.vrack.getVmById(
                this.model.currentLinkEdit.connectionVmId,
              );

              // set connection style
              this.model.currentLinkEdit.connection.setPaintStyle({
                strokeStyle: this.constructor.getLinkColor(
                  this.model.currentLinkEdit.connectedIp.type,
                ),
                lineWidth: 8,
                dashstyle: '2 1',
              });
              this.model.currentLinkEdit.connection.addClass(
                'cuc-highlighted-element cuc-highlighted-element-active',
              );
            } else if (this.model.currentLinkEdit.connectionCurrent) {
              this.model.currentLinkEdit.connectionCurrent.setPaintStyle({
                strokeStyle: this.constructor.getLinkColor(
                  this.model.currentLinkEdit.connectedIp.type,
                ),
                lineWidth: 4,
              });
            }
          },
          canAttachIpToVm: (ipSource, vmDest) => {
            const continentCode = get(ipSource, 'continentCode');
            let attachable = true;
            attachable = attachable && ipSource && vmDest;
            attachable = attachable && vmDest.status === 'ACTIVE';
            attachable =
              attachable &&
              continentCode &&
              continentCode === this.getVmContinent(vmDest);
            return attachable;
          },
        },
      };
    }

    // ------- JQUERY UI SORTABLE -------

    initInterval() {
      // redraw jsPlumb after sort
      this.sortInterval = setInterval(this.redrawLinks, 33);
    }

    initSortable() {
      this.sortableOptions = {
        cancel: '.sortable-disabled',
        axis: 'y',
        start: () => {
          this.states.sorting = true;
          this.initInterval();
        },
        stop: () => {
          this.states.sorting = false;
          if (this.sortInterval) {
            clearInterval(this.sortInterval);
            // redraw links for the last time and re-validate offset of non connected items
            this.redrawLinks(true);
          }
        },
        update: () => {
          this.$timeout(() => {
            // deffer save to let jqUI update the array
            this.CloudProjectComputeInfrastructureOrchestrator.saveToUserPref();
          });
        },
      };

      // create vm sortable options by extending sortable options
      this.vmSortableOptions = angular.extend(
        { handle: '.vm-grip' },
        this.sortableOptions,
      );

      // create ip sortable options by extending sortable options
      this.ipSortableOptions = angular.extend(
        { handle: '.ip-grip' },
        this.sortableOptions,
      );
    }

    // ------- END JQUERY UI SORTABLE -------

    // ------- VOLUME DISPLAY TOOLS -------

    initVolumeEdit() {
      this.volumeEdit = {
        action: null,
        volume: null, // Can be factory or not !
        srcVm: null,
        targetVm: null,
        targetVmId: null, // use for checkbox vm
        remove: {
          launchConfirm: (volume) => {
            this.OvhApiCloudProjectVolumeSnapshot.v6()
              .query({ serviceName: this.serviceName })
              .$promise.then((snapshots) => {
                if (find(snapshots, { volumeId: volume.id })) {
                  this.CucCloudMessage.error({
                    textHtml: this.$translate.instant(
                      'cpci_volume_snapshotted_delete_info',
                      {
                        url: this.$state.href(
                          'iaas.pci-project.compute.snapshot',
                        ),
                      },
                    ),
                  });
                } else {
                  this.volumeEdit.action = 'remove';
                  this.volumeEdit.volume = volume;
                  this.$rootScope.$broadcast(
                    'cuc-highlighted-element.show',
                    `compute,${volume.id}`,
                  );
                }
              })
              .catch((err) => {
                this.CucCloudMessage.error(
                  `${this.$translate.instant(
                    'cpci_volume_snapshot_error',
                  )} ${get(err, 'data.message', '')}`,
                );
              });
          },
          cancel: () => {
            this.volumeEdit.reInit();
            this.$rootScope.$broadcast('cuc-highlighted-element.hide');
          },
          confirm: () => {
            this.loaders.volumeActionConfirm = true;
            this.CloudProjectComputeVolumesOrchestrator.deleteVolume(
              this.volumeEdit.volume.id,
            )
              .then(() => {
                this.volumeEdit.reInit();
                this.$rootScope.$broadcast('cuc-highlighted-element.hide');
              })
              .catch((err) => {
                this.CucCloudMessage.error(
                  `${this.$translate.instant('cpci_volume_delete_error')} ${get(
                    err,
                    'data.message',
                    '',
                  )}`,
                );
              })
              .finally(() => {
                this.loaders.volumeActionConfirm = false;
              });
          },
        },
        move: {
          launchConfirm: (volume, srcVm, targetVm) => {
            this.volumeEdit.action = 'move';
            this.volumeEdit.volume = volume;
            this.volumeEdit.srcVm = srcVm; // use in interface
            this.volumeEdit.targetVm = targetVm;

            // set overlay
            this.$timeout(() => {
              // otherwise LAG
              this.$rootScope.$broadcast(
                'cuc-highlighted-element.show',
                `compute,${targetVm ? targetVm.id : 'unlinked_volumes'}`,
              );
            }, 100);
          },
          cancel: () => {
            this.initDragDropHelper(); // :-/
            this.volumeEdit.reInit();
            this.$rootScope.$broadcast('cuc-highlighted-element.hide');
          },
          confirm: () => {
            // Open volumes of VM target
            if (
              this.volumeEdit.targetVm &&
              !this.volumeEdit.targetVm.collapsedVolumes
            ) {
              this.CloudProjectComputeInfrastructureOrchestrator.toggleCollapsedVolumes(
                this.volumeEdit.targetVm,
              );
              this.refreshLinks();
            }

            this.initDragDropHelper(); // :-/
            this.loaders.volumeActionConfirm = true;
            this.CloudProjectComputeVolumesOrchestrator.moveVolume(
              this.volumeEdit.volume.id,
              this.volumeEdit.targetVm
                ? this.volumeEdit.targetVm.id
                : 'unlinked',
            )
              .then(() => {
                if (
                  this.volumeEdit.targetVm &&
                  this.volumeEdit.targetVm.image &&
                  this.volumeEdit.targetVm.image.type === 'windows'
                ) {
                  this.CucCloudMessage.info(
                    this.$translate.instant(
                      'cpci_volume_confirm_attach_windows_info',
                    ),
                  );
                }
              })
              .catch((err) => {
                this.CucCloudMessage.error(
                  `${this.$translate.instant(
                    'cpci_volume_confirm_detach_error',
                  )} ${get(err, 'data.message', '')}`,
                );
              })
              .finally(() => {
                this.loaders.volumeActionConfirm = false;
                this.volumeEdit.reInit();
                this.$rootScope.$broadcast('cuc-highlighted-element.hide');
              });
          },
        },
        moveCheckbox: {
          launchConfirm: (volume, srcVm) => {
            // list of compatible(s) vm(s) to attach the volume
            const compatibleVms = filter(
              this.infra.vrack.publicCloud.items,
              (vm) => this.volumeEdit.canAttachVolumeToVm(volume, vm),
            );

            // do we have at least one compatible vm?
            if (isArray(compatibleVms) && compatibleVms.length > 0) {
              this.volumeEdit.action = 'moveCheckbox';
              this.volumeEdit.volume = volume;
              this.volumeEdit.srcVm = srcVm; // use in interface

              // set overlay
              this.$timeout(() => {
                // otherwise LAG
                this.$rootScope.$broadcast(
                  'cuc-highlighted-element.show',
                  `compute,vm-ACTIVE-${volume.region}`,
                );
              }, 100);
            } else {
              this.CucCloudMessage.error(
                this.$translate.instant('cpci_volume_attach_error'),
              );
            }
          },
          cancel: () => {
            this.volumeEdit.move.cancel();
          },
          confirm: () => {
            this.volumeEdit.move.confirm();
          },
          isInvalid: () => !this.volumeEdit.targetVm,
          checkboxChange: (targetVm) => {
            this.volumeEdit.targetVm = targetVm;
          },
        },
        reInit: () => {
          this.volumeEdit.action = null;
          this.volumeEdit.volume = null;
          this.volumeEdit.srcVm = null;
          this.volumeEdit.targetVm = null;
        },
        canAttachVolumeToVm: (volumeSource, vmDest) => {
          let attachable = true;
          attachable = attachable && volumeSource && vmDest;
          attachable = attachable && vmDest.status === 'ACTIVE';
          attachable = attachable && volumeSource.region === vmDest.region;
          attachable =
            attachable && head(volumeSource.attachedTo) !== vmDest.id;
          return attachable;
        },
      };
    }

    toggleVolumeEditionState(volume, param) {
      if (!volume.openDetail) {
        if (param) {
          this.CloudProjectComputeVolumesOrchestrator.setEditVolumeParam(param);
        }
        this.CloudProjectComputeVolumesOrchestrator.turnOnVolumeEdition(volume);
      } else {
        this.CloudProjectComputeVolumesOrchestrator.turnOffVolumeEdition(true);
        this.$rootScope.$broadcast('cuc-highlighted-element.hide');
      }
    }

    /**
     * return the list of regions in which there is at least one unlinked volume
     * @returns {Array}
     */
    getUnlinkedVolumesRegions() {
      const regions = map(this.volumes.unlinked, (volume) => volume.region);

      // if we are doing a drag & drop, we add the dragged volume region to the list
      // so it will be displayed as a droppable target in the region list
      if (this.dragDropHelper.currentDraggedVolume) {
        regions.push(
          this.dragDropHelper.currentDraggedVolume.draggableInfo.volume.region,
        );
      }

      return uniq(regions);
    }

    getTranslatedRegion(region) {
      return region
        ? this.CucRegionService.getTranslatedMicroRegion(region)
        : '';
    }

    // ------- JQUERY UI DRAGGABLE -------

    initDraggable() {
      this.draggableOptions = {
        unlinked: {
          revert: 'invalid', // when not dropped, the item will revert back to its initial position
          containment: '#cloud-project-compute-infrastructure',
          scroll: true,
          scrollSensitivity: 100,
          appendTo: '#cloud-project-compute-infrastructure',
          helper: 'clone', // !important
        },
        linked: {
          revert: 'invalid', // when not dropped, the item will revert back to its initial position
          containment: '#cloud-project-compute-infrastructure',
          scroll: true,
          scrollSensitivity: 100,
          appendTo: '#cloud-project-compute-infrastructure',
          helper: 'clone', // !important
        },
      };
    }

    // ------- JQUERY UI DROPPABLE -------

    initDroppable() {
      this.droppableOptions = {
        unlinked: {
          accept: '.volume-content-linked-items > li',
        },
        vmUnlinked: (
          vm,
        ) => `.volume-content-unlinked-items > li.volume-detail-item-${vm.region},
                    .volume-content-linked-items:not('.volume-content-linked-items-${vm.id}') > li.volume-detail-item-${vm.region}`,
        // , linked: { } // Specific of region
      };
    }

    // ------- END VOLUME DISPLAY TOOLS -------

    // ------- PRIVATE NETWORKS -------

    static getVirtualMachinePrivateAddresses(vm) {
      if (!vm || !vm.ipAddresses) {
        return false;
      }

      return map(
        filter(vm.ipAddresses, (ip) => ip.type === 'private'),
        (ip) => ip.ip,
      );
    }

    fetchPrivateNetworks() {
      if (this.loaders.privateNetworks.query) {
        return;
      }

      this.loaders.privateNetworks.query = true;

      this.OvhApiCloudProjectNetworkPrivate.v6()
        .query({ serviceName: this.serviceName })
        .$promise.then((networks) => {
          this.collections.privateNetworks = networks;
        })
        .catch((err) => {
          this.collections.privateNetwork = [];
          this.CucCloudMessage.error(
            this.$translate.instant('cpci_private_network_query_error', {
              message: get(err, 'data.message', ''),
            }),
          );
        })
        .finally(() => {
          this.loaders.privateNetworks.query = false;
        });
    }

    hasPrivateIp(vm) {
      if (!this.vlans.vRackStatus) {
        return false;
      }

      return !!this.constructor.getVirtualMachinePrivateAddresses(vm).length;
    }

    anyVmEditMenuOpen() {
      return some(this.$document.find('.vm-actions-dropdown.open'));
    }

    removeAllFades() {
      if (this.anyVmEditMenuOpen()) {
        // disable the action when editing a VM.
        return;
      }

      const selectors = ['.faded-out', '.faded-path'];
      forEach(selectors, (selector) => {
        const nodes = this.$document.find(selector);
        forEach(nodes, (node) => {
          $(node).toggleClass(tail(selector).join(''));
        });
      });
      this.jsplumbInstance.select().removeClass('faded-path');
    }

    highlightInstanceAndPublicIP(e) {
      if (this.anyVmEditMenuOpen()) {
        // disable the action when editing a VM.
        return;
      }

      // instanceId can be a string of an id or an array of id.
      let currentInstanceId = $(e.currentTarget).data().instanceId;

      // always work with an array for uniformity
      if (isString(currentInstanceId)) {
        currentInstanceId = [currentInstanceId];
      }

      const instancesBox = this.$document.find('.public-cloud-vm');
      const publicIPs = this.$document.find('.ip');
      const plumbLink = this.jsplumbInstance.select({
        target: currentInstanceId,
      });

      // instanceBox is the currently highlighted instance
      const instanceBox = find(instancesBox, (box) =>
        includes(currentInstanceId, $(box).data().instanceId),
      );

      // ips linked to the currently highlighted instance
      const currentIps = filter(publicIPs, (ip) => {
        const { instanceId } = $(ip).data();
        return some(intersection(instanceId, currentInstanceId));
      });

      // fade everything
      // put fade on vm-infos, does not work directly on .public-cloud-vm
      // because of css conflicts I guess...
      instancesBox.find('.vm-infos').addClass('faded-out');
      publicIPs.addClass('faded-out');
      this.jsplumbInstance.select().addClass('faded-path');

      // remove faded for current instance/ip/instance->ip link
      plumbLink.removeClass('faded-path');
      $(instanceBox)
        .find('.vm-infos')
        .removeClass('faded-out');
      $(currentIps).removeClass('faded-out');
    }

    // ------- END PRIVATE NETWORKS -------
  }

  angular
    .module('managerApp')
    .controller(
      'CloudProjectComputeInfrastructureDiagramCtrl',
      CloudProjectComputeInfrastructureDiagramCtrl,
    );
})();
